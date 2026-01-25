import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import adminService from "@/services/admin.service";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  ArrowRight,
  MoreHorizontal,
  BookOpen,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const attendanceData = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 88, absent: 12 },
  { day: "Wed", present: 95, absent: 5 },
  { day: "Thu", present: 91, absent: 9 },
  { day: "Fri", present: 89, absent: 11 },
];

const weeklyTrends = [
  { week: "Week 1", attendance: 88 },
  { week: "Week 2", attendance: 91 },
  { week: "Week 3", attendance: 87 },
  { week: "Week 4", attendance: 94 },
];

const departmentData = [
  { name: "Computer Science", value: 35, color: "hsl(217, 91%, 60%)" },
  { name: "Engineering", value: 28, color: "hsl(152, 69%, 41%)" },
  { name: "Business", value: 22, color: "hsl(38, 92%, 50%)" },
  { name: "Arts", value: 15, color: "hsl(199, 89%, 48%)" },
];

const recentActivities = [
  { id: 1, user: "Dr. Sarah Johnson", action: "Marked attendance for CS-301", time: "5 min ago", avatar: "SJ" },
  { id: 2, user: "Prof. Mike Chen", action: "Updated curriculum for ENG-202", time: "12 min ago", avatar: "MC" },
  { id: 3, user: "Admin System", action: "Generated weekly attendance report", time: "1 hour ago", avatar: "AS" },
  { id: 4, user: "Dr. Emily Davis", action: "Created new activity: Python Workshop", time: "2 hours ago", avatar: "ED" },
];

const upcomingClasses = [
  { id: 1, subject: "Data Structures", time: "09:00 AM", room: "Lab 3", faculty: "Dr. Johnson", students: 45 },
  { id: 2, subject: "Machine Learning", time: "10:30 AM", room: "Room 201", faculty: "Prof. Chen", students: 38 },
  { id: 3, subject: "Web Development", time: "02:00 PM", room: "Lab 1", faculty: "Dr. Davis", students: 42 },
];

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(152, 69%, 41%)",
  "hsl(38, 92%, 50%)",
  "hsl(199, 89%, 48%)",
  "hsl(340, 82%, 52%)",
  "hsl(291, 64%, 42%)",
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex gap-3 animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <Button variant="outline" className="rounded-xl">
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button className="rounded-xl gradient-primary shadow-primary">
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <StatCard
              title="Total Students"
              value={loading ? "..." : stats?.totalStudents?.toString() || "0"}
              description="Active enrollments"
              icon={GraduationCap}
              variant="primary"
            />
          </div>
          <div className="animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <StatCard
              title="Faculty Members"
              value={loading ? "..." : stats?.totalFaculty?.toString() || "0"}
              description={`Across ${stats?.totalDepartments || 0} departments`}
              icon={Users}
              variant="success"
            />
          </div>
          <div className="animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <StatCard
              title="Attendance Rate"
              value={loading ? "..." : `${stats?.attendanceRate || 0}%`}
              description="This week average"
              icon={ClipboardCheck}
            />
          </div>
          <div className="animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <StatCard
              title="Active Courses"
              value={loading ? "..." : stats?.totalCourses?.toString() || "0"}
              description="Total courses"
              icon={BookOpen}
              variant="info"
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Attendance Trend Chart */}
          <Card className="lg:col-span-2 shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="font-display text-lg">Attendance Overview</CardTitle>
                <CardDescription>Daily attendance for this week</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={stats?.dailyAttendance || []}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152, 69%, 41%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(152, 69%, 41%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="day" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 32%, 91%)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="hsl(152, 69%, 41%)"
                    strokeWidth={2}
                    fill="url(#colorPresent)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg">By Department</CardTitle>
              <CardDescription>Student distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={(stats?.departmentDistribution || []).map((dept: any, index: number) => ({
                      name: dept.name,
                      value: dept.percentage,
                      color: COLORS[index % COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(stats?.departmentDistribution || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {(stats?.departmentDistribution || []).map((dept: any, index: number) => (
                  <div key={dept.code} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{dept.name}</span>
                    </div>
                    <span className="font-medium">{dept.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming Classes */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">Upcoming Classes</CardTitle>
                <CardDescription>Next sessions scheduled today</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(stats?.upcomingClasses || upcomingClasses).map((cls: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{cls.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.faculty} • {cls.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{cls.time}</p>
                    <p className="text-sm text-muted-foreground">{cls.students} students</p>
                  </div>
                </div>
              ))}
              {stats && stats.upcomingClasses?.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No upcoming classes today</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-5" style={{ opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest actions in the system</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(stats?.recentActivities || recentActivities).map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.time).toLocaleString([], {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {stats && (!stats.recentActivities || stats.recentActivities.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No recent activity</p>
              )}
            </CardContent>

          </Card>
        </div>

        {/* Weekly Performance */}
        <Card className="shadow-card rounded-xl animate-fade-in stagger-5" style={{ opacity: 0 }}>
          <CardHeader>
            <CardTitle className="font-display text-lg">Weekly Performance</CardTitle>
            <CardDescription>Attendance trends over the past month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.weeklyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="week" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 32%, 91%)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="attendance" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout >
  );
}
