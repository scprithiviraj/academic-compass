import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import timetableService from "@/services/timetable.service";
import activityService from "@/services/activity.service";
import attendanceService from "@/services/attendance.service";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ClipboardCheck,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  Trophy,
  CheckCircle2,
  Circle,
  ArrowRight,
  Play,
  Flame,
  Star,
  Calendar
} from "lucide-react";

const achievements = [
  { id: 1, title: "Perfect Week", icon: "🏆", description: "100% attendance this week", unlocked: true },
  { id: 2, title: "Early Bird", icon: "🌅", description: "On time for 10 classes", unlocked: true },
  { id: 3, title: "Activity Master", icon: "⚡", description: "Complete 20 activities", unlocked: false, progress: 65 },
  { id: 4, title: "Knowledge Seeker", icon: "📚", description: "Read 5 research papers", unlocked: false, progress: 40 },
];

const weeklyGoals = [
  { id: 1, title: "Attend all classes", current: 8, target: 10, color: "bg-primary" },
  { id: 2, title: "Complete activities", current: 5, target: 8, color: "bg-secondary" },
  { id: 3, title: "Study hours", current: 12, target: 20, color: "bg-info" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'STUDENT' || !user.studentId) return;

      try {
        console.log("Fetching student data for ID:", user.studentId);

        // Fetch Timetable
        try {
          const todaySchedule = await timetableService.getTodaySchedule(user.studentId, 'student');
          console.log("Schedule:", todaySchedule);
          if (todaySchedule) {
            const mappedSchedule = todaySchedule.map(s => ({
              id: s.slotId,
              subject: s.subject,
              time: `${s.startTime} - ${s.endTime}`,
              room: s.roomNumber,
              status: getTimeStatus(s.startTime, s.endTime),
              faculty: s.teacherName
            }));
            setSchedule(mappedSchedule);
          }
        } catch (err) {
          console.error("Error fetching timetable:", err);
        }

        // Fetch Stats
        try {
          const attendanceStats = await attendanceService.getAttendanceStats(user.studentId);
          console.log("Stats:", attendanceStats);
          setStats(attendanceStats);
        } catch (err) {
          console.error("Error fetching stats:", err);
          // Mock stats if fail
          setStats({ percentage: 0, totalClasses: 0, present: 0 });
        }

        // Fetch Activities
        try {
          const recs = await activityService.getRecommendedActivities(user.studentId);
          console.log("Activities:", recs);
          if (recs) {
            setActivities(recs.map(r => ({
              id: r.activity.activityId,
              title: r.activity.title,
              category: r.activity.category || 'Skill',
              duration: `${r.activity.duration || 30} min`,
              xp: (r.activity.duration || 30) * 10,
              difficulty: r.activity.level || 'Medium'
            })));
          }
        } catch (err) {
          console.error("Error fetching activities:", err);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getTimeStatus = (start: string, end: string) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Convert status HH:MM to minutes
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    // Check day (assuming today)
    if (currentTime > endMins) return "completed";
    if (currentTime >= startMins && currentTime <= endMins) return "ongoing";
    return "upcoming";
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-success/10", text: "text-success", icon: CheckCircle2 };
      case "ongoing":
        return { bg: "bg-primary/10", text: "text-primary", icon: Play };
      case "free":
        return { bg: "bg-accent/10", text: "text-accent", icon: Target };
      default:
        return { bg: "bg-muted", text: "text-muted-foreground", icon: Circle };
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header with greeting */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Good Morning, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              You have {schedule.length} classes scheduled today. Keep up the great work!
            </p>
          </div>
          <div className="flex items-center gap-3 animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
              <Flame className="h-5 w-5 text-accent" />
              <span className="font-semibold text-accent">12 Day Streak</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <StatCard
              title="Attendance Rate"
              value={`${stats?.percentage || 0}%`}
              description="This semester"
              icon={ClipboardCheck}
              trend={{ value: 2.1, isPositive: true }}
              variant="primary"
            />
          </div>
          <div className="animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <StatCard
              title="Activities Done"
              value="24"
              description="This month"
              icon={Target}
              trend={{ value: 8, isPositive: true }}
              variant="success"
            />
          </div>
          <div className="animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <StatCard
              title="XP Points"
              value={stats?.present ? `${stats.present * 10}` : "0"}
              description="Level 8 Student"
              icon={Star}
            />
          </div>
          <div className="animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <StatCard
              title="Classes Today"
              value={schedule.length.toString()}
              description="1 free period"
              icon={Calendar}
              variant="info"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2 shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">Today's Schedule</CardTitle>
                <CardDescription>Your classes and activities for today</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Full calendar
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedule.length === 0 ? (
                <p className="text-muted-foreground text-sm p-4 text-center">No classes scheduled for today.</p>
              ) : (
                schedule.map((item) => {
                  const styles = getStatusStyles(item.status);
                  const StatusIcon = styles.icon;

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md ${item.status === "ongoing" ? "border-primary bg-primary/5" : "border-border"
                        }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.bg}`}>
                        <StatusIcon className={`h-5 w-5 ${styles.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{item.subject}</p>
                          {item.status === "ongoing" && (
                            <Badge className="bg-primary text-primary-foreground text-xs">Live</Badge>
                          )}
                          {item.status === "free" && (
                            <Badge variant="outline" className="text-xs border-accent text-accent">
                              Free Period
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.faculty !== "-" && `${item.faculty} • `}{item.room !== "-" && item.room}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${item.status === "ongoing" ? "text-primary" : ""}`}>
                          {item.time}
                        </p>
                        {item.status === "free" && (
                          <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                            Start activity →
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <CardHeader>
              <CardTitle className="font-display text-lg">Weekly Goals</CardTitle>
              <CardDescription>Track your progress this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {weeklyGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-muted-foreground">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${goal.color}`}
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-2xl font-bold font-display text-primary">67%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep going! You're on track to hit all your goals.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Suggested Activities */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">Suggested Activities</CardTitle>
                <CardDescription>Personalized for your free periods</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Browse all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recommended activities right now.</p>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                      <BookOpen className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.duration}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {activity.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-accent font-medium">
                        <Star className="h-4 w-4" />
                        <span>+{activity.xp} XP</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-5" style={{ opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">Achievements</CardTitle>
                <CardDescription>Your badges and milestones</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-xl border p-4 transition-all ${achievement.unlocked
                      ? "border-accent/50 bg-accent/5"
                      : "border-border bg-muted/30 opacity-70"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {achievement.description}
                        </p>
                        {!achievement.unlocked && achievement.progress && (
                          <div className="mt-2">
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {achievement.progress}% complete
                            </p>
                          </div>
                        )}
                        {achievement.unlocked && (
                          <Badge className="mt-2 bg-accent text-accent-foreground text-[10px]">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
