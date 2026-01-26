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
  Legend,
  LineChart,
  Line,
} from "recharts";

const XP_PER_LEVEL = 150;

const userStats = {
  totalXP: 2450,
  level: Math.floor(2450 / XP_PER_LEVEL),
  currentStreak: 12,
  longestStreak: 21,
  activitiesCompleted: 28,
  totalTimeSpent: 1840, // minutes
  rank: 15,
  totalStudents: 156,
};

const xpHistory = [
  { date: "Week 1", xp: 180 },
  { date: "Week 2", xp: 320 },
  { date: "Week 3", xp: 250 },
  { date: "Week 4", xp: 420 },
  { date: "Week 5", xp: 380 },
  { date: "Week 6", xp: 290 },
  { date: "Week 7", xp: 350 },
  { date: "Week 8", xp: 260 },
];

const skillsData = [
  { skill: "Coding", level: 85, fullMark: 100 },
  { skill: "Research", level: 72, fullMark: 100 },
  { skill: "Problem Solving", level: 88, fullMark: 100 },
  { skill: "Reading", level: 65, fullMark: 100 },
  { skill: "Projects", level: 78, fullMark: 100 },
  { skill: "Practice", level: 82, fullMark: 100 },
];

const activityByCategory = [
  { category: "Coding", completed: 12, color: "hsl(var(--primary))" },
  { category: "Research", completed: 5, color: "hsl(var(--info))" },
  { category: "Projects", completed: 4, color: "hsl(var(--warning))" },
  { category: "Reading", completed: 3, color: "hsl(var(--success))" },
  { category: "Practice", completed: 4, color: "hsl(var(--secondary))" },
];

const achievements = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first activity",
    icon: Star,
    earned: true,
    earnedAt: new Date(2024, 0, 5),
    color: "text-warning",
  },
  {
    id: "2",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    earned: true,
    earnedAt: new Date(2024, 0, 12),
    color: "text-destructive",
  },
  {
    id: "3",
    name: "Code Master",
    description: "Complete 10 coding activities",
    icon: Code,
    earned: true,
    earnedAt: new Date(2024, 0, 18),
    color: "text-primary",
  },
  {
    id: "4",
    name: "Knowledge Seeker",
    description: "Complete 5 research activities",
    icon: BookOpen,
    earned: true,
    earnedAt: new Date(2024, 0, 22),
    color: "text-info",
  },
  {
    id: "5",
    name: "Rising Star",
    description: "Reach Level 10",
    icon: TrendingUp,
    earned: true,
    earnedAt: new Date(2024, 0, 25),
    color: "text-success",
  },
  {
    id: "6",
    name: "Innovator",
    description: "Complete 3 project activities",
    icon: Lightbulb,
    earned: true,
    earnedAt: new Date(2024, 0, 28),
    color: "text-warning",
  },
  {
    id: "7",
    name: "Marathon Runner",
    description: "Maintain a 21-day streak",
    icon: Trophy,
    earned: false,
    progress: 12,
    target: 21,
    color: "text-muted-foreground",
  },
  {
    id: "8",
    name: "Top Performer",
    description: "Reach top 10 in leaderboard",
    icon: Medal,
    earned: false,
    progress: 15,
    target: 10,
    color: "text-muted-foreground",
  },
  {
    id: "9",
    name: "Legend",
    description: "Reach Level 25",
    icon: Crown,
    earned: false,
    progress: userStats.level,
    target: 25,
    color: "text-muted-foreground",
  },
];

const recentActivity = [
  { date: "Today", activity: "Algorithm Practice", xp: 50, category: "Coding" },
  { date: "Yesterday", activity: "Data Structures Review", xp: 75, category: "Reading" },
  { date: "Jan 25", activity: "Research Paper Analysis", xp: 100, category: "Research" },
  { date: "Jan 24", activity: "Mini Project: Todo App", xp: 150, category: "Projects" },
  { date: "Jan 23", activity: "SQL Exercises", xp: 60, category: "Practice" },
];

export default function ProgressPage() {
  const currentLevelXP = userStats.totalXP % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - currentLevelXP;
  const levelProgress = (currentLevelXP / XP_PER_LEVEL) * 100;

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
                <Progress value={levelProgress} className="h-3" />
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
                    <span className="text-2xl font-bold">#{userStats.rank}</span>
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
              <p className="text-2xl font-bold">{userStats.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Longest Streak</p>
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
            {/* Earned Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Earned Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {achievements
                    .filter((a) => a.earned)
                    .map((achievement) => (
                      <div
                        key={achievement.id}
                        className="p-4 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 text-center group hover:scale-105 transition-transform"
                      >
                        <div className={`mx-auto mb-2 ${achievement.color}`}>
                          <achievement.icon className="h-10 w-10 mx-auto" />
                        </div>
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{activity.activity}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {activity.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{activity.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-warning">
                          <Zap className="h-4 w-4" />
                          <span className="font-medium">+{activity.xp}</span>
                        </div>
                      </div>
                    ))}
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
