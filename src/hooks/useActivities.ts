import { useState, useCallback, useMemo } from "react";
import { Activity, UserActivity, ActivityCategory, ActivityDifficulty, ActivityStatus, UserStats } from "@/types/activity";
import { activitiesData, userActivitiesData, userStatsData, calculateLevel, getXPForNextLevel, getCurrentLevelXP } from "@/data/activities";
import { useToast } from "@/hooks/use-toast";

export function useActivities() {
  const [activities] = useState<Activity[]>(activitiesData);
  const [userActivities, setUserActivities] = useState<UserActivity[]>(userActivitiesData);
  const [userStats, setUserStats] = useState<UserStats>(userStatsData);
  const { toast } = useToast();

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<ActivityDifficulty | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

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
        activity.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

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
  const startActivity = useCallback((activityId: string) => {
    const existing = getUserActivity(activityId);
    if (existing) return;

    const newUserActivity: UserActivity = {
      id: `ua-${Date.now()}`,
      activityId,
      status: "in_progress",
      progress: 0,
      completedSteps: [],
      startedAt: new Date(),
      xpEarned: 0,
    };

    setUserActivities((prev) => [...prev, newUserActivity]);
    
    toast({
      title: "Activity Started! 🚀",
      description: "Good luck with your learning journey!",
    });
  }, [getUserActivity, toast]);

  // Complete a step
  const completeStep = useCallback((activityId: string, stepId: string) => {
    setUserActivities((prev) => {
      return prev.map((ua) => {
        if (ua.activityId !== activityId) return ua;

        const activity = activities.find((a) => a.id === activityId);
        if (!activity) return ua;

        const newCompletedSteps = ua.completedSteps.includes(stepId)
          ? ua.completedSteps
          : [...ua.completedSteps, stepId];

        const progress = Math.round((newCompletedSteps.length / activity.steps.length) * 100);
        const isCompleted = progress === 100;

        if (isCompleted && ua.status !== "completed") {
          // Award XP when completing
          const xpEarned = activity.xp;
          setUserStats((stats) => {
            const newTotalXP = stats.totalXP + xpEarned;
            const newLevel = calculateLevel(newTotalXP);
            
            if (newLevel > stats.level) {
              toast({
                title: "Level Up! 🎉",
                description: `Congratulations! You've reached Level ${newLevel}!`,
              });
            }

            return {
              ...stats,
              totalXP: newTotalXP,
              level: newLevel,
              activitiesCompleted: stats.activitiesCompleted + 1,
            };
          });

          toast({
            title: "Activity Completed! 🏆",
            description: `You earned ${xpEarned} XP!`,
          });

          return {
            ...ua,
            completedSteps: newCompletedSteps,
            progress,
            status: "completed" as const,
            completedAt: new Date(),
            xpEarned,
          };
        }

        return {
          ...ua,
          completedSteps: newCompletedSteps,
          progress,
        };
      });
    });
  }, [activities, toast]);

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

  // Level progress
  const levelProgress = useMemo(() => {
    const xpForNext = getXPForNextLevel(userStats.level);
    const currentLevelXP = getCurrentLevelXP(userStats.totalXP, userStats.level);
    return {
      current: currentLevelXP,
      required: 150,
      percentage: Math.round((currentLevelXP / 150) * 100),
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
  };
}
