import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { studentService } from "@/services/student.service";
import { ScheduleClass } from "@/types/schedule";
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
  Calendar,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Goal } from "@/services/student.service";


const weeklyGoals = [
  { id: 1, title: "Attend all classes", current: 8, target: 10, color: "bg-primary" },
  { id: 2, title: "Complete activities", current: 5, target: 8, color: "bg-secondary" },
  { id: 3, title: "Study hours", current: 12, target: 20, color: "bg-info" },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gameStats, setGameStats] = useState<any>(null);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: "",
    description: "",
    targetDate: "",
    goalType: "SHORT",
    status: "IN_PROGRESS"
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'STUDENT' || !user.studentId) return;

      try {
        console.log("Fetching student data for ID:", user.studentId);

        let todaySchedule: any[] = []; // Declare todaySchedule here

        // Fetch Timetable
        try {
          todaySchedule = await timetableService.getTodaySchedule(user.studentId, 'student');
          // Handled in the merge block below to include attendance
        } catch (err) {
          console.error("Error fetching timetable:", err);
        }

        // Fetch Weekly Schedule for Stats
        let weeklyClasses: ScheduleClass[] = [];
        try {
          const weeklyData = await studentService.getWeeklySchedule(user.userId);
          // Map backend data to frontend model just like SchedulePage
          weeklyClasses = weeklyData.map((item, index) => {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayIndex = days.indexOf(item.dayOfWeek);
            return {
              id: item.slotId.toString(),
              subject: item.subject,
              faculty: item.teacherName || "Unknown",
              room: item.roomNumber,
              startTime: item.startTime.substring(0, 5),
              endTime: item.endTime.substring(0, 5),
              status: "upcoming",
              color: "", // Not needed for calculation
              day: dayIndex === 0 ? 7 : dayIndex,
            };
          });
          // Store this separately if we want to use it, or just calculate stats directly
          // I'll store it in a new state variable if I need to re-render, 
          // but for simple stats I can just calculate here and store in stats state.
        } catch (err) {
          console.error("Failed to fetch weekly schedule", err);
        }

        let fetchedAttendanceStats: any = null;

        // Fetch Stats (Only keeping percentage for the stats card)
        try {
          fetchedAttendanceStats = await attendanceService.getAttendanceStats(user.userId);
          setStats({
            percentage: fetchedAttendanceStats.percentage,
          });
        } catch (err) {
          console.error("Error fetching stats:", err);
          setStats({ percentage: 0 });
        }

        // Fetch Today's Attendance Real-time
        try {
          const today = new Date().toLocaleDateString('en-CA');
          const attendanceRecords = await attendanceService.getAttendanceByDateRange(user.userId, today, today);

          if (todaySchedule) {
            const mergedSchedule = todaySchedule
              .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
              .map(s => {
                // Find matching attendance record for this session
                // We match by checking if the record's session start time matches the schedule start time
                // The attendance record from backend contains 'session' object with 'startTime'
                const record = attendanceRecords.find((r: any) => {
                  // Handle potential format differences (HH:mm:ss vs HH:mm)
                  const rStart = r.session?.startTime?.substring(0, 5);
                  const sStart = s.startTime.substring(0, 5);
                  return rStart === sStart;
                });

                const isFreePeriod = record?.session?.method === 'FREE_PERIOD';

                return {
                  id: s.slotId,
                  subject: s.subject,
                  time: `${s.startTime} - ${s.endTime}`,
                  room: s.roomNumber,
                  status: isFreePeriod ? 'free' : getTimeStatus(s.startTime, s.endTime),
                  faculty: s.teacherName,
                  attendanceStatus: record ? record.status : 'NOT_MARKED'
                };
              });
            setSchedule(mergedSchedule);
          }
        } catch (err) {
          console.error("Error merging attendance:", err);
        }

        // Fetch Activities
        try {
          const recs = await activityService.getRecommendedActivities(user.studentId);
          if (recs) {
            setActivities(recs.map(r => ({
              id: r.activity.activityId,
              title: r.activity.title,
              category: r.activity.category || 'Skill',
              duration: `${r.activity.durationMinutes || 30} min`,
              xp: (r.activity.durationMinutes || 30) * 10,
              difficulty: r.activity.difficulty || 'Medium'
            })));
          }
        } catch (err) {
          console.error("Error fetching activities:", err);
        }

        // Fetch Gamification Stats
        if (user.userId) {
          try {
            const gStats = await activityService.getGamificationStats(user.userId);
            setGameStats(gStats);
          } catch (err) {
            console.error("Error fetching gamification stats:", err);
          }
        }

        // Fetch Goals
        if (user.studentId) {
          try {
            const fetchedGoals = await studentService.getGoals(user.studentId);
            setGoals(fetchedGoals);
          } catch (err) {
            console.error("Error fetching goals:", err);
          }
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

  const handleSaveGoal = async () => {
    if (!user?.studentId) return;
    try {
      if (editingGoal?.goalId) {
        // Update
        await studentService.updateGoal(editingGoal.goalId, editingGoal as Goal);
      } else {
        // Add
        await studentService.addGoal(user.studentId, newGoal as Goal);
      }
      // Refresh
      const fetchedGoals = await studentService.getGoals(user.studentId);
      setGoals(fetchedGoals);
      setIsGoalModalOpen(false);
      setEditingGoal(null);
      setNewGoal({ title: "", description: "", targetDate: "", goalType: "SHORT", status: "IN_PROGRESS" });
    } catch (err) {
      console.error("Error saving goal:", err);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!user?.studentId) return;
    try {
      await studentService.deleteGoal(goalId);
      const fetchedGoals = await studentService.getGoals(user.studentId);
      setGoals(fetchedGoals);
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  const openGoalModal = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
    } else {
      setEditingGoal(null);
      setNewGoal({ title: "", description: "", targetDate: "", goalType: "SHORT", status: "IN_PROGRESS" });
    }
    setIsGoalModalOpen(true);
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
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <StatCard
              title="Attendance Rate"
              value={`${stats?.percentage || 0}%`}
              description="This semester"
              icon={ClipboardCheck}
              variant="primary"
            />
          </div>
          <div className="animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <StatCard
              title="Activities Done"
              value={gameStats?.activitiesCompleted?.toString() || "0"}
              description="Total Completed"
              icon={Target}
              variant="success"
            />
          </div>
          <div className="animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <StatCard
              title="XP Points"
              value={gameStats?.totalXP?.toString() || "0"}
              description={gameStats?.level ? `Level ${gameStats.level} Student` : "Beginner"}
              icon={Star}
            />
          </div>
          <div className="animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <StatCard
              title="Classes Today"
              value={schedule.length.toString()}
              description={`${schedule.filter(s => s.status === 'free').length} free periods`}
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
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/student/schedule')}>
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
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-md ${item.status === "ongoing" ? "border-primary bg-primary/5" : "border-border"
                        }`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${styles.bg}`}>
                        <StatusIcon className={`h-4 w-4 ${styles.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{item.subject}</p>
                          {item.status === "ongoing" && (
                            <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 h-5">Live</Badge>
                          )}
                          {item.status === "free" && (
                            <Badge variant="outline" className="text-[10px] border-accent text-accent px-1.5 h-5">
                              Free
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.faculty !== "-" && `${item.faculty} • `}{item.room !== "-" && item.room}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-medium ${item.status === "ongoing" ? "text-primary" : ""}`}>
                          {item.time}
                        </p>
                        {item.status === "free" && getTimeStatus(item.time.split(' - ')[0], item.time.split(' - ')[1]) !== 'completed' && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-primary text-[10px]"
                            onClick={() => navigate('/student/activities')}
                          >
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Today's Attendance Status */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg">Today's Attendance</CardTitle>
              <CardDescription>Status for {new Date().toLocaleDateString('en-US', { weekday: 'long' })}'s classes</CardDescription>
            </CardHeader>
            <CardContent>
              {schedule.length === 0 ? (
                <p className="text-muted-foreground text-sm">No classes to attend today.</p>
              ) : (
                <div className="space-y-3">
                  {schedule.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-all">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-medium text-sm truncate">{item.subject}</span>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>

                      {item.attendanceStatus === 'PRESENT' && (
                        <Badge className="bg-success/15 text-success hover:bg-success/20 border-0 text-[10px] px-2 py-0.5">
                          Present
                        </Badge>
                      )}

                      {item.attendanceStatus === 'ABSENT' && (
                        <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/20 border-0 text-[10px] px-2 py-0.5">
                          Absent
                        </Badge>
                      )}

                      {item.attendanceStatus === 'LATE' && (
                        <Badge className="bg-warning/15 text-warning hover:bg-warning/20 border-0 text-[10px] px-2 py-0.5">
                          Late
                        </Badge>
                      )}

                      {item.attendanceStatus === 'NOT_MARKED' && (
                        <Badge variant="outline" className="text-muted-foreground text-[10px] px-2 py-0.5">
                          Not Marked
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/student/activities')}>
                Browse all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-foreground">Content coming soon</h4>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  We are curating the best activities for you. Check back later!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-5" style={{ opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">My Goals</CardTitle>
                <CardDescription>Track your academic targets</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => setIsGoalModalOpen(true)}>
                Manage Goals
                <Pencil className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">No goals set yet.</p>
                  <Button variant="link" onClick={() => openGoalModal()} className="mt-2 text-primary">
                    + Add your first goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.goalId}
                      className={`group rounded-xl border p-4 transition-all ${goal.status === 'COMPLETED'
                        ? "border-success/30 bg-success/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium text-sm truncate ${goal.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}`}>
                              {goal.title}
                            </h4>
                            <Badge variant={goal.goalType === 'SHORT' ? 'secondary' : 'default'} className="text-[10px] h-5 px-1.5">
                              {goal.goalType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {goal.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Target: {goal.targetDate}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openGoalModal(goal)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingGoal ? "Edit Goal" : "Manage Goals"}</DialogTitle>
                <DialogDescription>
                  Set and track your academic goals here. Updates are saved automatically.
                </DialogDescription>
              </DialogHeader>

              {!editingGoal ? (
                // List View (Management)
                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Your Goals List</h3>
                    <Button size="sm" onClick={() => openGoalModal({} as any)}>
                      <Plus className="h-4 w-4 mr-1" /> Add New
                    </Button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                    {goals.map((goal) => (
                      <div key={goal.goalId} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="font-medium text-sm truncate">{goal.title}</p>
                          <p className="text-xs text-muted-foreground">{goal.status} • {goal.targetDate}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingGoal(goal)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => goal.goalId && handleDeleteGoal(goal.goalId)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {goals.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No goals found.</p>}
                  </div>
                </div>
              ) : (
                // Edit/Add Form
                <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingGoal.goalId ? editingGoal.title : newGoal.title}
                      onChange={(e) => editingGoal.goalId
                        ? setEditingGoal({ ...editingGoal, title: e.target.value })
                        : setNewGoal({ ...newGoal, title: e.target.value })}
                      placeholder="e.g., Score A in Math"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={editingGoal.goalId ? editingGoal.goalType : newGoal.goalType}
                      onValueChange={(val: any) => editingGoal.goalId
                        ? setEditingGoal({ ...editingGoal, goalType: val })
                        : setNewGoal({ ...newGoal, goalType: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHORT">Short Term</SelectItem>
                        <SelectItem value="LONG">Long Term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea
                      id="desc"
                      value={editingGoal.goalId ? editingGoal.description : newGoal.description}
                      onChange={(e) => editingGoal.goalId
                        ? setEditingGoal({ ...editingGoal, description: e.target.value })
                        : setNewGoal({ ...newGoal, description: e.target.value })}
                      placeholder="Details about your goal..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Target Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={editingGoal.goalId ? editingGoal.targetDate : newGoal.targetDate}
                        onChange={(e) => editingGoal.goalId
                          ? setEditingGoal({ ...editingGoal, targetDate: e.target.value })
                          : setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={editingGoal.goalId ? editingGoal.status : newGoal.status}
                        onValueChange={(val: any) => editingGoal.goalId
                          ? setEditingGoal({ ...editingGoal, status: val })
                          : setNewGoal({ ...newGoal, status: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditingGoal(null)}>Cancel</Button>
                    <Button onClick={handleSaveGoal}>{editingGoal.goalId ? 'Update' : 'Add Goal'}</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
}
