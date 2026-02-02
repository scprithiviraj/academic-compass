import { useState, useCallback, useMemo, useEffect } from "react";
import { Activity, UserActivity, ActivityCategory, ActivityDifficulty, ActivityStatus, UserStats } from "@/types/activity";
import activityService, { StudentActivityProgressResponse } from "@/services/activity.service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalXP: 0,
    level: 1,
    activitiesCompleted: 0,
    currentStreak: 0,
    totalTimeSpent: 0
  });
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const { user } = useAuth();

  // Get userId from authenticated user
  const userId = user?.userId;

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<ActivityDifficulty | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchActivities = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [allActivities, progress, stats] = await Promise.all([
        activityService.getAllActivities(),
        activityService.getStudentActivityProgress(userId),
        activityService.getGamificationStats(userId)
      ]);

      console.group('Activity Action: Fetch All');
      console.log('Response - All Activities:', allActivities);
      console.log('Response - Student Progress:', progress);
      console.log('Response - Stats:', stats);
      console.groupEnd();

      if (stats) {
        setUserStats(stats);
      }

      // Map backend activities to frontend interface
      const mappedActivities: Activity[] = allActivities.map(a => ({
        id: a.activityId.toString(),
        activityId: a.activityId,
        title: a.title,
        description: a.description,
        // Map backend string to frontend literal types if needed, or cast
        category: a.category || "Skills",
        difficulty: (a.difficulty as ActivityDifficulty) || "Intermediate",
        durationMinutes: a.durationMinutes,
        xp: a.xp || 0,
        skills: [], // Backend doesn't return skills list primarily yet
        steps: (a.steps && a.steps.length > 0) ? a.steps.map((s: any) => ({
          id: `step-${s.stepNumber}`,
          title: s.title,
          description: s.description,
          completed: false
        })) : Array(a.totalSteps || 1).fill({ id: '1', title: 'Step 1', count: 1 }).map((_, i) => ({
          id: `step-${i + 1}`,
          title: `Step ${i + 1}`,
          description: `Complete step ${i + 1}`,
          completed: false
        })),
        totalSteps: a.totalSteps
      }));

      setActivities(mappedActivities as unknown as Activity[]);

      // Map progress to UserActivity
      const mappedUserActivities: UserActivity[] = progress.map(p => ({
        id: `ua-${p.activityId}`,
        activityId: p.activityId.toString(),
        status: (p.status?.toLowerCase().replace(' ', '_') as ActivityStatus) || "not_started",
        progress: p.progressPercentage || 0,
        // Map list of step numbers (1-based) to step IDs 'step-X'
        completedSteps: (p.completedStepNumbers || []).map(num => `step-${num}`),
        xpEarned: 0 // Fetch actual earned XP if available
      }));

      setUserActivities(mappedUserActivities);

    } catch (error) {
      console.error("Failed to fetch activities", error);
      toast({
        title: "Error",
        description: "Failed to load activities. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Get user activity status for an activity
  const getUserActivity = useCallback((activityId: string): UserActivity | undefined => {
    return userActivities.find((ua) => ua.activityId === activityId);
  }, [userActivities]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const userActivity = getUserActivity(activity.id);
      const status = userActivity?.status || "not_started";

      const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "all" || activity.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activity.skills || []).some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesDifficulty && matchesStatus && matchesSearch;
    });
  }, [activities, categoryFilter, difficultyFilter, statusFilter, searchQuery, getUserActivity]);

  // Get activity with user progress
  const getActivityWithProgress = useCallback((activityId: string) => {
    const activity = activities.find((a) => a.id === activityId);
    const userActivity = getUserActivity(activityId);
    return { activity, userActivity };
  }, [activities, getUserActivity]);

  // Start an activity
  const startActivity = useCallback(async (activityId: string) => {
    if (!userId) return;

    try {
      // Find the activity to get the numeric activityId
      const activity = activities.find((a) => a.id === activityId);
      if (!activity || !activity.activityId) {
        toast({
          title: "Error",
          description: "Activity not found.",
          variant: "destructive"
        });
        return;
      }

      // Enroll the student in the activity
      // Using userId as per recent service update
      const response = await activityService.enrollInActivity(userId, activity.activityId);

      console.group('Activity Action: Start Activity');
      console.log('Activity ID:', activityId);
      console.log('Response - Enrollment:', response);
      console.groupEnd();
      // Immediately update local state to show the activity as in_progress
      setUserActivities((prev) => {
        // Check if already exists
        const exists = prev.find((ua) => ua.activityId === activityId);
        if (exists) {
          // Update existing to in_progress
          return prev.map((ua) =>
            ua.activityId === activityId
              ? { ...ua, status: "in_progress" as ActivityStatus, progress: 0 }
              : ua
          );
        } else {
          // Add new enrollment
          return [
            ...prev,
            {
              id: `ua-${activity.activityId}`,
              activityId: activityId,
              status: "in_progress" as ActivityStatus,
              progress: 0,
              completedSteps: [],
              xpEarned: 0,
            }
          ];
        }
      });

      toast({
        title: "Activity Started! 🚀",
        description: "Good luck with your learning journey!",
      });

      // Refresh activities in the background to sync with backend
      fetchActivities();
    } catch (error: any) {
      console.error("Failed to start activity:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to start activity. Please try again.",
        variant: "destructive"
      });
    }
  }, [userId, activities, fetchActivities, toast]);

  // Complete a step
  const completeStep = useCallback(async (activityId: string, stepId: string) => {
    if (!userId) return;

    const existing = getUserActivity(activityId);
    if (!existing) return;

    // Check if already completed
    if (existing.completedSteps.includes(stepId)) {
      return;
    }

    // Extract numeric stepId from string (e.g., "step-1" -> 1)
    const numericStepId = parseInt(stepId.replace('step-', ''));

    const activity = activities.find(a => a.id === activityId);
    if (!activity || !activity.activityId) return;

    try {
      // Call backend to complete the step
      const progressResponse = await activityService.completeActivityStep(userId, activity.activityId, numericStepId);

      console.group('Activity Action: Complete Step');
      console.log('Activity ID:', activityId, 'Step ID:', stepId);
      console.log('Response - Progress Update:', progressResponse);
      console.groupEnd();
      // Update local state with server response
      setUserActivities((prev) => {
        return prev.map((ua) => {
          if (ua.activityId !== activityId) return ua;

          const newCompletedSteps = existing.completedSteps.includes(stepId)
            ? existing.completedSteps
            : [...existing.completedSteps, stepId];

          const isCompleted = progressResponse.status === "COMPLETED";

          if (isCompleted && ua.status !== "completed") {
            const activity = activities.find((a) => a.id === activityId);
            const xpEarned = activity?.xp || 0;

            toast({
              title: "Activity Completed! 🏆",
              description: `You earned ${xpEarned} XP!`,
            });

            // Fetch updated stats from backend to sync XP and Level
            activityService.getGamificationStats(userId).then(stats => {
              if (stats) setUserStats(stats);
            });
          }

          return {
            ...ua,
            completedSteps: newCompletedSteps,
            progress: progressResponse.progressPercentage,
            status: progressResponse.status.toLowerCase().replace('_', '_') as ActivityStatus
          };
        });
      });
    } catch (error) {
      console.error("Progress update failed", error);
      toast({
        title: "Error",
        description: "Failed to update progress on server.",
        variant: "destructive"
      });
    }
  }, [activities, getUserActivity, userId, toast]);

  // Get in-progress activities
  const inProgressActivities = useMemo(() => {
    return userActivities
      .filter((ua) => ua.status === "in_progress")
      .map((ua) => ({
        ...ua,
        activity: activities.find((a) => a.id === ua.activityId)!,
      }))
      .filter((item) => item.activity);
  }, [userActivities, activities]);

  // Get completed activities
  const completedActivities = useMemo(() => {
    return userActivities
      .filter((ua) => ua.status === "completed")
      .map((ua) => ({
        ...ua,
        activity: activities.find((a) => a.id === ua.activityId)!,
      }))
      .filter((item) => item.activity);
  }, [userActivities, activities]);

  // Get featured activities
  const featuredActivities = useMemo(() => {
    return activities.filter((a) => a.featured);
  }, [activities]);

  // Level progress - Use backend values
  const levelProgress = useMemo(() => {
    return {
      current: userStats.totalXP,
      required: userStats.xpForNextLevel || (150 * userStats.level), // Fallback to calculation
      percentage: userStats.xpProgressPercentage || 0, // Fallback to 0 if not provided
    };
  }, [userStats]);

  return {
    activities,
    filteredActivities,
    userActivities,
    userStats,
    levelProgress,
    inProgressActivities,
    completedActivities,
    featuredActivities,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    getUserActivity,
    getActivityWithProgress,
    startActivity,
    completeStep,
    loading
  };
}
