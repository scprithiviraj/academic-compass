import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Zap,
  Target,
  Flame,
  TrendingUp,
  Star,
  BookOpen,
  Code,
  Lightbulb,
  Trophy,
  Medal,
  Crown,
  Sparkles,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useActivities } from "@/hooks/useActivities";
import { useMemo } from "react";

const XP_PER_LEVEL = 150;

export default function ProgressPage() {
  const { userStats, userActivities, activities, loading } = useActivities();

  // Calculate derived stats
  const currentLevelXP = userStats.totalXP % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - currentLevelXP;
  const levelProgress = (currentLevelXP / XP_PER_LEVEL) * 100;

  // Calculate category stats for charts
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; xp: number }> = {};

    // Initialize with known categories
    ["Coding", "Research", "Projects", "Reading", "Comp. Skills", "Aptitude"].forEach(cat => {
      stats[cat] = { total: 0, completed: 0, xp: 0 };
    });

    activities.forEach(activity => {
      const category = activity.category || "Other";
      if (!stats[category]) stats[category] = { total: 0, completed: 0, xp: 0 };

      stats[category].total++;

      const userActivity = userActivities.find(ua => ua.activityId === activity.id);
      if (userActivity?.status === "completed") {
        stats[category].completed++;
        stats[category].xp += activity.xp;
      }
    });

    return stats;
  }, [activities, userActivities]);

  const skillsData = useMemo(() => {
    return Object.entries(categoryStats).map(([skill, data]) => ({
      skill,
      level: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      fullMark: 100
    })).filter(item => item.skill !== "Other"); // Filter out 'Other' for radar chart
  }, [categoryStats]);

  const activityByCategory = useMemo(() => {
    const colors = ["hsl(var(--primary))", "hsl(var(--info))", "hsl(var(--warning))", "hsl(var(--success))", "hsl(var(--secondary))", "hsl(var(--accent))"];
    return Object.entries(categoryStats).map(([category, data], index) => ({
      category,
      completed: data.completed,
      color: colors[index % colors.length]
    })).filter(item => item.completed > 0);
  }, [categoryStats]);

  // Derive achievements based on real data
  const achievements = useMemo(() => {
    const completedCount = userStats.activitiesCompleted;

    return [
      {
        id: "1",
        name: "First Steps",
        description: "Complete your first activity",
        icon: Star,
        earned: completedCount >= 1,
        color: "text-warning",
      },
      {
        id: "3",
        name: "Code Master",
        description: "Complete 5 coding activities",
        icon: Code,
        earned: (categoryStats["Coding"]?.completed || 0) >= 5,
        progress: categoryStats["Coding"]?.completed || 0,
        target: 5,
        color: "text-primary",
      },
      {
        id: "5",
        name: "Rising Star",
        description: "Reach Level 5",
        icon: TrendingUp,
        earned: userStats.level >= 5,
        progress: userStats.level,
        target: 5,
        color: "text-success",
      },
      {
        id: "6",
        name: "Expert Learner",
        description: "Complete 10 activities",
        icon: Lightbulb,
        earned: completedCount >= 10,
        progress: completedCount,
        target: 10,
        color: "text-info",
      }
    ];
  }, [userStats, categoryStats]);

  // Mock history for now since we don't have timestamp data
  const xpHistory = [
    { date: "Week 1", xp: Math.round(userStats.totalXP * 0.1) },
    { date: "Week 2", xp: Math.round(userStats.totalXP * 0.3) },
    { date: "Week 3", xp: Math.round(userStats.totalXP * 0.6) },
    { date: "Current", xp: userStats.totalXP },
  ];

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Progress</h1>
          <p className="text-muted-foreground mt-1">
            Track your XP, achievements, and skill development
          </p>
        </div>

        {/* Level & XP Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-background to-info/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">{userStats.level}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <h2 className="text-2xl font-bold">Level {userStats.level}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {xpToNextLevel} XP to Level {userStats.level + 1}
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress to next level</span>
                  <span className="text-sm text-muted-foreground">
                    {currentLevelXP} / {XP_PER_LEVEL} XP
                  </span>
                </div>
                <Progress value={levelProgress} className="h-3 bg-background/50" />
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center text-warning">
                    <Zap className="h-5 w-5" />
                    <span className="text-2xl font-bold">{userStats.totalXP}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center text-destructive">
                    <Flame className="h-5 w-5" />
                    <span className="text-2xl font-bold">{userStats.currentStreak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center text-primary">
                    <Target className="h-5 w-5" />
                    <span className="text-2xl font-bold">Top 20%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rank</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 mx-auto text-warning mb-2" />
              <p className="text-2xl font-bold">{userStats.activitiesCompleted}</p>
              <p className="text-xs text-muted-foreground">Activities Done</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto text-info mb-2" />
              <p className="text-2xl font-bold">{Math.round(userStats.totalTimeSpent / 60)}h</p>
              <p className="text-xs text-muted-foreground">Time Invested</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 mx-auto text-destructive mb-2" />
              <p className="text-2xl font-bold">{userStats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto text-success mb-2" />
              <p className="text-2xl font-bold">{achievements.filter((a) => a.earned).length}</p>
              <p className="text-xs text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="history">XP History</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">


            {/* Locked Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  Upcoming Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements
                    .filter((a) => !a.earned)
                    .map((achievement) => (
                      <div
                        key={achievement.id}
                        className="p-4 rounded-xl bg-muted/30 border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                            <achievement.icon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {achievement.description}
                            </p>
                            {achievement.progress !== undefined && achievement.target && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>
                                    {achievement.progress}/{achievement.target}
                                  </span>
                                </div>
                                <Progress
                                  value={(achievement.progress / achievement.target) * 100}
                                  className="h-1.5"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillsData}>
                        <PolarGrid className="stroke-muted" />
                        <PolarAngleAxis dataKey="skill" className="text-xs" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                        <Radar
                          name="Skill Level"
                          dataKey="level"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillsData.map((skill) => (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <Badge variant="outline">{skill.level}%</Badge>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                  {skillsData.length === 0 && (
                    <div className="text-center text-muted-foreground">No skill data available yet.</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Activities by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Activities by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityByCategory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="category" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* XP Trend */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>XP Earned Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={xpHistory}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="xp"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
