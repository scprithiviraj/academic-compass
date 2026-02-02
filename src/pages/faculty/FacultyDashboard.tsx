import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { facultyService, DashboardClass, DashboardStats, WeeklyTrendData, LowAttendanceAlert } from "@/services/faculty.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
  ClipboardList,
  Loader2,
  RefreshCw,
  BookOpen,
  BarChart3,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayClasses, setTodayClasses] = useState<DashboardClass[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrendData[]>([]);
  const [lowAttendanceAlerts, setLowAttendanceAlerts] = useState<LowAttendanceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLowAttendanceDialog, setShowLowAttendanceDialog] = useState(false);

  const fetchAllDashboardData = useCallback(async (showToast = false) => {
    if (!user?.userId) return;

    try {
      if (showToast) setIsRefreshing(true);
      else setIsLoading(true);

      // Fetch all dashboard data in parallel
      const [classesData, statsData, trendData, alertsData] = await Promise.all([
        facultyService.getDashboardData(user.userId),
        facultyService.getDashboardStats(user.userId),
        facultyService.getWeeklyTrend(user.userId),
        facultyService.getLowAttendanceAlerts(user.userId),
      ]);

      setTodayClasses(classesData);
      setDashboardStats(statsData);
      setWeeklyTrend(trendData);
      setLowAttendanceAlerts(alertsData);

      if (showToast) {
        toast({
          title: "Dashboard Refreshed",
          description: "All data has been updated successfully",
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  const handleRefresh = () => {
    fetchAllDashboardData(true);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-success/10", text: "text-success", label: "Completed" };
      case "ongoing":
        return { bg: "bg-primary/10", text: "text-primary", label: "In Progress" };
      default:
        return { bg: "bg-muted", text: "text-muted-foreground", label: "Upcoming" };
    }
  };

  const currentClass = useMemo(() =>
    todayClasses.find(c => c.status === "ongoing"),
    [todayClasses]
  );

  const currentProgress = useMemo(() =>
    currentClass ? (currentClass.attendance / currentClass.students) * 100 : 0,
    [currentClass]
  );

  const quickActions = [
    {
      title: "Mark Attendance",
      description: "Quick access to attendance",
      icon: ClipboardList,
      color: "from-blue-500 to-blue-600",
      action: () => navigate('/faculty/attendance'),
    },
    {
      title: "View Students",
      description: "Manage student information",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      action: () => navigate('/faculty/students'),
    },
    {
      title: "Analytics",
      description: "View detailed insights",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      action: () => navigate('/faculty/analytics'),
    },
    {
      title: "Classes",
      description: "View your schedule",
      icon: BookOpen,
      color: "from-orange-500 to-orange-600",
      action: () => navigate('/faculty/classes'),
    },
  ];

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || 'Faculty'}! You have {dashboardStats?.classesToday || 0} classes scheduled today.
            </p>
          </div>
          <div className="flex gap-3 animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => navigate('/faculty/attendance')}
              className="rounded-xl gradient-primary shadow-primary"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Attendance
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
                <StatCard
                  title="Total Students"
                  value={dashboardStats?.totalStudents.toString() || "0"}
                  description="Across all sections"
                  icon={Users}
                  variant="primary"
                />
              </div>
              <div className="animate-fade-in stagger-2" style={{ opacity: 0 }}>
                <StatCard
                  title="Today's Attendance"
                  value={`${dashboardStats?.todayAttendancePercentage || 0}%`}
                  description={dashboardStats?.todayAttendanceCount || "0/0 present"}
                  icon={ClipboardCheck}
                  variant="success"
                />
              </div>
              <div className="animate-fade-in stagger-3" style={{ opacity: 0 }}>
                <StatCard
                  title="Classes Today"
                  value={dashboardStats?.classesToday.toString() || "0"}
                  description={`${dashboardStats?.classesCompleted || 0} completed, ${dashboardStats?.classesOngoing || 0} ongoing`}
                  icon={Calendar}
                />
              </div>
              <div className="animate-fade-in stagger-4" style={{ opacity: 0 }}>
                <StatCard
                  title="Low Attendance"
                  value={lowAttendanceAlerts.length.toString()}
                  description="Students below 75%"
                  icon={AlertTriangle}
                  variant="warning"
                />
              </div>
            </div>

            {/* Quick Actions - Sticky Header */}
            <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b mb-6 transition-all">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => (
                  <Card
                    key={action.title}
                    className="shadow-card rounded-xl cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in overflow-hidden group border-primary/10"
                    style={{ opacity: 0, animationDelay: `${index * 100}ms` }}
                    onClick={action.action}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} text-white group-hover:scale-110 transition-transform`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{action.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Current Class Progress */}
              <Card className="shadow-card rounded-xl animate-fade-in stagger-2 lg:col-span-2" style={{ opacity: 0 }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-display text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Current Class
                      </CardTitle>
                      <CardDescription>
                        {currentClass ? "Mark attendance for ongoing class" : "Currently no live classes running"}
                      </CardDescription>
                    </div>
                    {currentClass && (
                      <Badge className="bg-primary/10 text-primary border-0 px-3 py-1">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          Live
                        </div>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {currentClass ? (
                    <>
                      {/* Class Info */}
                      <div className="p-4 rounded-xl bg-muted/50 border">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg">{currentClass.subject}</p>
                            <p className="text-sm text-muted-foreground">Section {currentClass.section}</p>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">{currentClass.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                          <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-success" />
                          <p className="text-2xl font-bold text-success">{currentClass.attendance}</p>
                          <p className="text-xs text-muted-foreground">Present</p>
                        </div>
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
                          <XCircle className="h-5 w-5 mx-auto mb-2 text-destructive" />
                          <p className="text-2xl font-bold text-destructive">{currentClass.students - currentClass.attendance}</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                          <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold text-primary">{currentClass.students}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-bold text-primary">{Math.round(currentProgress)}%</span>
                        </div>
                        <Progress value={currentProgress} className="h-2" />
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => navigate('/faculty/attendance')}
                        className="w-full rounded-xl"
                      >
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Mark Attendance
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">No Live Class</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mt-1">
                        You don't have any classes currently running. Check your schedule for upcoming sessions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Today's Classes */}
              <Card className="shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Today's Classes
                  </CardTitle>
                  <CardDescription>Your schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayClasses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No classes today</p>
                  ) : (
                    todayClasses.map((cls) => {
                      const styles = getStatusStyles(cls.status);

                      return (
                        <div
                          key={cls.id}
                          className={`rounded-xl border p-3 transition-all hover:shadow-md ${cls.status === "ongoing"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                            }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">{cls.subject}</p>
                              <p className="text-xs text-muted-foreground">Section {cls.section}</p>
                            </div>
                            <Badge className={`${styles.bg} ${styles.text} border-0 text-xs`}>
                              {styles.label}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {cls.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{cls.status === "completed" ? `${cls.attendance}/` : ""}{cls.students}</span>
                            </div>
                          </div>
                          {cls.status === "ongoing" && (
                            <Button
                              onClick={() => navigate('/faculty/attendance')}
                              className="w-full mt-2 rounded-lg"
                              variant="default"
                              size="sm"
                            >
                              Mark Attendance
                            </Button>
                          )}
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Weekly Trend */}
              <Card className="shadow-card rounded-xl animate-fade-in stagger-4" style={{ opacity: 0 }}>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Weekly Attendance Trend
                  </CardTitle>
                  <CardDescription>Average attendance across your classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="day" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                      <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(0, 0%, 100%)",
                          border: "1px solid hsl(214, 32%, 91%)",
                          borderRadius: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={3}
                        dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, fill: "hsl(217, 91%, 60%)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Low Attendance Alerts */}
              <Card className="shadow-card rounded-xl animate-fade-in stagger-5" style={{ opacity: 0 }}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      Low Attendance Alerts
                    </CardTitle>
                    <CardDescription>Students below 75% threshold</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowLowAttendanceDialog(true)}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {lowAttendanceAlerts.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success" />
                      <p className="text-muted-foreground">No low attendance alerts</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lowAttendanceAlerts.slice(0, 3).map((student) => (
                        <div
                          key={student.userId}
                          className="flex items-center gap-4 rounded-xl border border-warning/30 bg-gradient-to-r from-warning/5 to-warning/10 p-4 hover:shadow-md transition-all"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-warning/20 text-warning font-medium">
                              {student.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-warning text-lg">{student.attendance}%</p>
                            <p className="text-xs text-muted-foreground">{student.classes}</p>
                          </div>
                        </div>
                      ))}

                      {lowAttendanceAlerts.length > 3 && (
                        <Button
                          variant="ghost"
                          className="w-full text-primary hover:bg-primary/10"
                          onClick={() => setShowLowAttendanceDialog(true)}
                        >
                          View all {lowAttendanceAlerts.length} alerts
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <Dialog open={showLowAttendanceDialog} onOpenChange={setShowLowAttendanceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Low Attendance Alerts
            </DialogTitle>
            <DialogDescription>
              Students with attendance below 75% threshold
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-3">
              {lowAttendanceAlerts.map((student) => (
                <div
                  key={student.userId}
                  className="flex items-center gap-4 rounded-xl border border-warning/30 bg-gradient-to-r from-warning/5 to-warning/10 p-4 hover:shadow-md transition-all"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-warning/20 text-warning font-medium">
                      {student.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-warning text-lg">{student.attendance}%</p>
                    <p className="text-xs text-muted-foreground">{student.classes}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
