import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowRight,
  QrCode,
  Scan,
  BookOpen,
  TrendingUp,
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

const todayClasses = [
  { id: 1, subject: "Data Structures", time: "09:00 - 10:30", section: "CS-A", students: 45, status: "completed", attendance: 42 },
  { id: 2, subject: "Data Structures", time: "11:00 - 12:30", section: "CS-B", students: 42, status: "ongoing", attendance: 0 },
  { id: 3, subject: "Algorithms", time: "02:00 - 03:30", section: "CS-A", students: 45, status: "upcoming", attendance: 0 },
];

const currentClassStudents = [
  { id: 1, name: "Alice Johnson", rollNo: "CS2021001", present: true, avatar: "AJ" },
  { id: 2, name: "Bob Smith", rollNo: "CS2021002", present: true, avatar: "BS" },
  { id: 3, name: "Charlie Brown", rollNo: "CS2021003", present: false, avatar: "CB" },
  { id: 4, name: "Diana Ross", rollNo: "CS2021004", present: true, avatar: "DR" },
  { id: 5, name: "Ethan Hunt", rollNo: "CS2021005", present: true, avatar: "EH" },
  { id: 6, name: "Fiona Green", rollNo: "CS2021006", present: false, avatar: "FG" },
  { id: 7, name: "George Miller", rollNo: "CS2021007", present: true, avatar: "GM" },
  { id: 8, name: "Hannah White", rollNo: "CS2021008", present: true, avatar: "HW" },
];

const weeklyData = [
  { day: "Mon", attendance: 92 },
  { day: "Tue", attendance: 88 },
  { day: "Wed", attendance: 95 },
  { day: "Thu", attendance: 91 },
  { day: "Fri", attendance: 89 },
];

const lowAttendanceAlerts = [
  { id: 1, name: "Charlie Brown", rollNo: "CS2021003", attendance: 62, classes: "12/20" },
  { id: 2, name: "Fiona Green", rollNo: "CS2021006", attendance: 68, classes: "14/20" },
  { id: 3, name: "Jake Wilson", rollNo: "CS2021015", attendance: 71, classes: "15/20" },
];

export default function FacultyDashboard() {
  const [students, setStudents] = useState(currentClassStudents);
  const presentCount = students.filter((s) => s.present).length;

  const toggleAttendance = (id: number) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  const markAllPresent = () => {
    setStudents(students.map((s) => ({ ...s, present: true })));
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

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, Dr. Johnson! You have 3 classes scheduled today.
            </p>
          </div>
          <div className="flex gap-3 animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <Button variant="outline" className="rounded-xl">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR
            </Button>
            <Button className="rounded-xl gradient-primary shadow-primary">
              <Scan className="mr-2 h-4 w-4" />
              Quick Scan
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <StatCard
              title="Total Students"
              value="132"
              description="Across all sections"
              icon={Users}
              variant="primary"
            />
          </div>
          <div className="animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <StatCard
              title="Today's Attendance"
              value="93%"
              description="42/45 present"
              icon={ClipboardCheck}
              trend={{ value: 3, isPositive: true }}
              variant="success"
            />
          </div>
          <div className="animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <StatCard
              title="Classes Today"
              value="3"
              description="1 completed, 1 ongoing"
              icon={Calendar}
            />
          </div>
          <div className="animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <StatCard
              title="Low Attendance"
              value="3"
              description="Students below 75%"
              icon={AlertTriangle}
              variant="warning"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Classes */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <CardHeader>
              <CardTitle className="font-display text-lg">Today's Classes</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayClasses.map((cls) => {
                const styles = getStatusStyles(cls.status);
                
                return (
                  <div
                    key={cls.id}
                    className={`rounded-xl border p-4 transition-all ${
                      cls.status === "ongoing"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{cls.subject}</p>
                        <p className="text-sm text-muted-foreground">Section {cls.section}</p>
                      </div>
                      <Badge className={`${styles.bg} ${styles.text} border-0`}>
                        {styles.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {cls.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.status === "completed" ? `${cls.attendance}/` : ""}{cls.students}</span>
                      </div>
                    </div>
                    {cls.status === "ongoing" && (
                      <Button className="w-full mt-3 rounded-xl" variant="default">
                        Mark Attendance
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Attendance */}
          <Card className="lg:col-span-2 shadow-card rounded-xl animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">Quick Attendance</CardTitle>
                <CardDescription>
                  Data Structures - Section CS-B • {presentCount}/{students.length} present
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-lg" onClick={markAllPresent}>
                  Mark All Present
                </Button>
                <Button size="sm" className="rounded-lg gradient-success">
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto scrollbar-thin pr-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all cursor-pointer ${
                      student.present
                        ? "border-success/50 bg-success/5"
                        : "border-destructive/50 bg-destructive/5"
                    }`}
                    onClick={() => toggleAttendance(student.id)}
                  >
                    <Checkbox
                      checked={student.present}
                      className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                    />
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`text-xs font-medium ${
                        student.present ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      }`}>
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.rollNo}</p>
                    </div>
                    {student.present ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Trend */}
          <Card className="shadow-card rounded-xl animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <CardHeader>
              <CardTitle className="font-display text-lg">Weekly Attendance Trend</CardTitle>
              <CardDescription>Average attendance across your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="day" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} domain={[80, 100]} />
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
              <Button variant="ghost" size="sm" className="text-primary">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {lowAttendanceAlerts.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 rounded-xl border border-warning/30 bg-warning/5 p-4"
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
                    <p className="font-bold text-warning">{student.attendance}%</p>
                    <p className="text-xs text-muted-foreground">{student.classes} classes</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full rounded-xl">
                Send Reminder Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
