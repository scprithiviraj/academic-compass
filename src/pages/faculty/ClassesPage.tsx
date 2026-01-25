import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  TrendingUp,
  ClipboardCheck,
  ChevronRight,
  Eye,
  Download,
  QrCode,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ClassData {
  id: string;
  subject: string;
  code: string;
  section: string;
  semester: number;
  schedule: { day: string; time: string; room: string }[];
  students: number;
  avgAttendance: number;
  lastClass?: string;
}

interface StudentData {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  attendance: number;
  classesAttended: number;
  totalClasses: number;
  lastAttended?: string;
}

const classesData: ClassData[] = [
  {
    id: "1",
    subject: "Data Structures",
    code: "CS-301",
    section: "CS-A",
    semester: 3,
    schedule: [
      { day: "Monday", time: "09:00 - 10:30", room: "Lab 3" },
      { day: "Wednesday", time: "09:00 - 10:30", room: "Lab 3" },
      { day: "Friday", time: "11:00 - 12:30", room: "Room 201" },
    ],
    students: 45,
    avgAttendance: 92,
    lastClass: "Jan 24, 2025",
  },
  {
    id: "2",
    subject: "Data Structures",
    code: "CS-301",
    section: "CS-B",
    semester: 3,
    schedule: [
      { day: "Monday", time: "11:00 - 12:30", room: "Lab 3" },
      { day: "Wednesday", time: "11:00 - 12:30", room: "Lab 3" },
      { day: "Friday", time: "02:00 - 03:30", room: "Room 201" },
    ],
    students: 42,
    avgAttendance: 88,
    lastClass: "Jan 24, 2025",
  },
  {
    id: "3",
    subject: "Algorithms",
    code: "CS-401",
    section: "CS-A",
    semester: 4,
    schedule: [
      { day: "Tuesday", time: "09:00 - 10:30", room: "Room 301" },
      { day: "Thursday", time: "09:00 - 10:30", room: "Room 301" },
    ],
    students: 45,
    avgAttendance: 90,
    lastClass: "Jan 23, 2025",
  },
  {
    id: "4",
    subject: "Algorithms",
    code: "CS-401",
    section: "CS-B",
    semester: 4,
    schedule: [
      { day: "Tuesday", time: "11:00 - 12:30", room: "Room 301" },
      { day: "Thursday", time: "11:00 - 12:30", room: "Room 301" },
    ],
    students: 40,
    avgAttendance: 85,
    lastClass: "Jan 23, 2025",
  },
];

const studentsData: StudentData[] = [
  { id: "1", name: "Alice Johnson", rollNo: "CS2021001", email: "alice.j@university.edu", attendance: 96, classesAttended: 24, totalClasses: 25, lastAttended: "Jan 24" },
  { id: "2", name: "Bob Smith", rollNo: "CS2021002", email: "bob.s@university.edu", attendance: 92, classesAttended: 23, totalClasses: 25, lastAttended: "Jan 24" },
  { id: "3", name: "Charlie Brown", rollNo: "CS2021003", email: "charlie.b@university.edu", attendance: 68, classesAttended: 17, totalClasses: 25, lastAttended: "Jan 20" },
  { id: "4", name: "Diana Ross", rollNo: "CS2021004", email: "diana.r@university.edu", attendance: 88, classesAttended: 22, totalClasses: 25, lastAttended: "Jan 24" },
  { id: "5", name: "Ethan Hunt", rollNo: "CS2021005", email: "ethan.h@university.edu", attendance: 100, classesAttended: 25, totalClasses: 25, lastAttended: "Jan 24" },
  { id: "6", name: "Fiona Green", rollNo: "CS2021006", email: "fiona.g@university.edu", attendance: 72, classesAttended: 18, totalClasses: 25, lastAttended: "Jan 22" },
  { id: "7", name: "George Miller", rollNo: "CS2021007", email: "george.m@university.edu", attendance: 84, classesAttended: 21, totalClasses: 25, lastAttended: "Jan 24" },
  { id: "8", name: "Hannah White", rollNo: "CS2021008", email: "hannah.w@university.edu", attendance: 96, classesAttended: 24, totalClasses: 25, lastAttended: "Jan 24" },
];

const attendanceTrendData = [
  { week: "Week 1", attendance: 88 },
  { week: "Week 2", attendance: 92 },
  { week: "Week 3", attendance: 86 },
  { week: "Week 4", attendance: 94 },
  { week: "Week 5", attendance: 90 },
];

const todaySchedule = [
  { id: "1", subject: "Data Structures", section: "CS-A", time: "09:00 - 10:30", room: "Lab 3", status: "completed" },
  { id: "2", subject: "Data Structures", section: "CS-B", time: "11:00 - 12:30", room: "Lab 3", status: "ongoing" },
  { id: "3", subject: "Algorithms", section: "CS-A", time: "02:00 - 03:30", room: "Room 301", status: "upcoming" },
];

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const filteredClasses = classesData.filter((cls) => {
    const matchesSearch =
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester =
      semesterFilter === "all" || cls.semester.toString() === semesterFilter;
    return matchesSearch && matchesSemester;
  });

  const lowAttendanceStudents = studentsData.filter((s) => s.attendance < 75);

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

  const getAttendanceBadge = (attendance: number) => {
    if (attendance >= 90) return "bg-success text-success-foreground";
    if (attendance >= 75) return "bg-primary text-primary-foreground";
    if (attendance >= 60) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">My Classes</h1>
            <p className="text-muted-foreground mt-1">
              Manage your classes, students, and attendance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="rounded-xl gradient-primary shadow-primary">
              <QrCode className="mr-2 h-4 w-4" />
              Start Class
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classesData.length}</div>
              <p className="text-xs text-muted-foreground">Across {new Set(classesData.map(c => c.semester)).size} semesters</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classesData.reduce((acc, c) => acc + c.students, 0)}</div>
              <p className="text-xs text-muted-foreground">Enrolled in your classes</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Attendance</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(classesData.reduce((acc, c) => acc + c.avgAttendance, 0) / classesData.length)}%
              </div>
              <p className="text-xs text-success">+2.3% from last week</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySchedule.length}</div>
              <p className="text-xs text-muted-foreground">
                {todaySchedule.filter(c => c.status === "completed").length} completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="classes" className="rounded-lg">All Classes</TabsTrigger>
            <TabsTrigger value="students" className="rounded-lg">Students</TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-lg">Schedule</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Today's Schedule */}
              <Card className="shadow-card rounded-xl">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Today's Schedule</CardTitle>
                  <CardDescription>Your classes for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todaySchedule.map((cls) => {
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
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {cls.room}
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

              {/* Attendance Trend */}
              <Card className="shadow-card rounded-xl">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Attendance Trend</CardTitle>
                  <CardDescription>Weekly attendance across all classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={attendanceTrendData}>
                      <defs>
                        <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="week" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                      <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} domain={[80, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={2}
                        fill="url(#colorAttendance)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Low Attendance Students */}
            {lowAttendanceStudents.length > 0 && (
              <Card className="shadow-card rounded-xl border-warning/30">
                <CardHeader className="flex flex-row items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <CardTitle className="font-display text-lg">Low Attendance Alerts</CardTitle>
                    <CardDescription>Students below 75% attendance threshold</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {lowAttendanceStudents.map((student) => (
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
                          <p className="text-xs text-muted-foreground">
                            {student.classesAttended}/{student.totalClasses}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Classes Tab */}
          <TabsContent value="classes" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="font-display text-lg">All Classes</CardTitle>
                    <CardDescription>Manage your assigned classes</CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search classes..."
                        className="pl-10 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        <SelectItem value="3">Semester 3</SelectItem>
                        <SelectItem value="4">Semester 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredClasses.map((cls) => (
                    <Dialog key={cls.id}>
                      <DialogTrigger asChild>
                        <div
                          className="rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                          onClick={() => setSelectedClass(cls)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{cls.subject}</h3>
                              <p className="text-sm text-muted-foreground">
                                {cls.code} • Section {cls.section}
                              </p>
                            </div>
                            <Badge variant="outline">Sem {cls.semester}</Badge>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Students</span>
                              <span className="font-medium">{cls.students}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Avg Attendance</span>
                                <span className="font-medium">{cls.avgAttendance}%</span>
                              </div>
                              <Progress value={cls.avgAttendance} className="h-2" />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{cls.schedule.length} classes/week</span>
                              <ChevronRight className="h-4 w-4 ml-auto" />
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>{cls.subject}</DialogTitle>
                          <DialogDescription>
                            {cls.code} • Section {cls.section} • Semester {cls.semester}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-muted/50 p-3 text-center">
                              <p className="text-2xl font-bold">{cls.students}</p>
                              <p className="text-sm text-muted-foreground">Students</p>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3 text-center">
                              <p className="text-2xl font-bold">{cls.avgAttendance}%</p>
                              <p className="text-sm text-muted-foreground">Avg Attendance</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Schedule</h4>
                            <div className="space-y-2">
                              {cls.schedule.map((s, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between rounded-lg border p-3"
                                >
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{s.day}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{s.time}</span>
                                    <span>{s.room}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button className="flex-1 rounded-xl">
                              <Eye className="mr-2 h-4 w-4" />
                              View Students
                            </Button>
                            <Button variant="outline" className="flex-1 rounded-xl">
                              <Download className="mr-2 h-4 w-4" />
                              Export Report
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="font-display text-lg">Student List</CardTitle>
                    <CardDescription>All students across your classes</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead className="text-center">Classes</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                      <TableHead>Last Attended</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsData
                      .filter(
                        (s) =>
                          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                                  {student.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{student.rollNo}</TableCell>
                          <TableCell className="text-center">
                            {student.classesAttended}/{student.totalClasses}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={getAttendanceBadge(student.attendance)}>
                              {student.attendance}%
                            </Badge>
                          </TableCell>
                          <TableCell>{student.lastAttended}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Weekly Schedule</CardTitle>
                <CardDescription>Your complete class schedule for the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                    const dayClasses = classesData.flatMap((cls) =>
                      cls.schedule
                        .filter((s) => s.day === day)
                        .map((s) => ({ ...s, subject: cls.subject, section: cls.section, code: cls.code }))
                    );

                    return (
                      <div key={day} className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-3">{day}</h3>
                        {dayClasses.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No classes scheduled</p>
                        ) : (
                          <div className="space-y-2">
                            {dayClasses.map((cls, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{cls.subject}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {cls.code} • Section {cls.section}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {cls.time}
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {cls.room}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
