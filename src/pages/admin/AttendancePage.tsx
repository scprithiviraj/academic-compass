import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import {
  BarChart3,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  GraduationCap,
  FileSpreadsheet,
  PieChart as PieChartIcon,
  LayoutGrid,
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
  LineChart,
  Line,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import adminService from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";

// Keep some mocks for tabs not yet fully connected if needed, or replace them.
const monthlyData = [
  { week: "Week 1", rate: 88 },
  { week: "Week 2", rate: 91 },
  { week: "Week 3", rate: 87 },
  { week: "Week 4", rate: 93 },
];


export default function AdminAttendancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // State for dynamic data
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentCount: 0,
    lateCount: 0,
    absentCount: 0
  });

  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [classData, setClassData] = useState<any[]>([]);
  const [departmentAttendance, setDepartmentAttendance] = useState<any[]>([]);
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  // Fetch data when date changes
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDailyAttendanceStats(date);
      setStats({
        totalStudents: data.totalStudents,
        presentCount: data.presentCount,
        lateCount: data.lateCount,
        absentCount: data.absentCount
      });
      setWeeklyTrend(data.weeklyTrend || []);

      // Map class data if necessary or use as is if backend matches.
      // Backend returns: { id, subject, section, faculty, present, absent, total }
      // Frontend expects: { id, subject, section, faculty, total, present, late, absent, rate }
      const mappedClasses = (data.classWiseData || []).map((c: any) => ({
        ...c,
        late: 0, // backend default 0 for now
        rate: c.total > 0 ? Math.round((c.present / c.total) * 100) : 0
      }));
      setClassData(mappedClasses);

      // Map department data
      const mappedDepts = (data.departmentWiseData || []).map((d: any) => ({
        ...d,
        rate: d.rate || 0
      }));
      setDepartmentAttendance(mappedDepts);

      // Fetch Low Attendance Students
      const alerts = await adminService.getLowAttendanceStudents();
      setLowAttendanceStudents(alerts);

      // Fetch Departments for filter
      const depts = await adminService.getAllDepartments();
      setDepartments(depts);

    } catch (error) {
      console.error("Failed to fetch attendance stats", error);
      toast({ title: "Failed to load attendance data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const totalStudents = stats.totalStudents;
  const presentToday = stats.presentCount;
  const lateToday = stats.lateCount;
  const absentToday = stats.absentCount;
  // const overallRate = totalStudents > 0 ? Math.round((presentToday + lateToday) / totalStudents * 100) : 0;

  const filteredClasses = classData.filter(cls =>
    (cls.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cls.faculty || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cls.section || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = lowAttendanceStudents.filter(student =>
    (departmentFilter === "all" || student.department === departmentFilter) &&
    (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pieData = [
    { name: "Present", value: presentToday, color: "hsl(152, 69%, 41%)" },
    { name: "Late", value: lateToday, color: "hsl(38, 92%, 50%)" },
    { name: "Absent", value: absentToday, color: "hsl(0, 84%, 60%)" },
  ].filter(d => d.value > 0);




  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Attendance Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor attendance across all departments and classes
            </p>
          </div>
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card rounded-xl animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{totalStudents.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present Today</p>
                  <p className="text-3xl font-bold text-success">{presentToday.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card rounded-xl animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Late Arrivals</p>
                  <p className="text-3xl font-bold text-warning">{lateToday}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card rounded-xl animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Absent Today</p>
                  <p className="text-3xl font-bold text-destructive">{absentToday}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid rounded-xl h-12 p-1 bg-muted/50">
            <TabsTrigger value="overview" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Departments</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Classes</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Weekly Trend Chart */}
              <Card className="lg:col-span-2 shadow-card rounded-xl">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Weekly Attendance Trend</CardTitle>
                  <CardDescription>Daily breakdown for the current week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyTrend}>
                      <defs>
                        <linearGradient id="colorPresentAdmin" x1="0" y1="0" x2="0" y2="1">
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
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="present"
                        name="Present %"
                        stroke="hsl(152, 69%, 41%)"
                        strokeWidth={2}
                        fill="url(#colorPresentAdmin)"
                      />
                      <Line type="monotone" dataKey="late" name="Late %" stroke="hsl(38, 92%, 50%)" strokeWidth={2} />
                      <Line type="monotone" dataKey="absent" name="Absent %" stroke="hsl(0, 84%, 60%)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Attendance Distribution Pie */}
              <Card className="shadow-card rounded-xl">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Today's Distribution</CardTitle>
                  <CardDescription>Overall attendance breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {departmentAttendance.map((dept, index) => (
                <Card key={dept.name} className="shadow-card rounded-xl card-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${dept.color}20` }}
                        >
                          <Building2 className="h-5 w-5" style={{ color: dept.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">{dept.students} students</p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "font-semibold",
                          dept.rate >= 90
                            ? "bg-success/10 text-success"
                            : dept.rate >= 80
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {dept.rate}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Present Today</span>
                        <span className="font-medium">{dept.present} / {dept.students}</span>
                      </div>
                      <Progress value={dept.rate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Department Comparison Chart */}
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Department Comparison</CardTitle>
                <CardDescription>Attendance rates across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentAttendance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis type="number" domain={[0, 100]} stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(215, 16%, 47%)" fontSize={12} width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(214, 32%, 91%)",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="rate" name="Attendance %" radius={[0, 6, 6, 0]}>
                      {departmentAttendance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6 animate-fade-in">
            {/* Search and Filters */}
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by subject, faculty, or section..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Button variant="outline" className="rounded-xl gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export to Excel
              </Button>
            </div>

            {/* Classes Table */}
            <Card className="shadow-card rounded-xl">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{cls.section}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{cls.faculty}</TableCell>
                        <TableCell className="text-center">{cls.total}</TableCell>
                        <TableCell className="text-center text-success font-medium">{cls.present}</TableCell>
                        <TableCell className="text-center text-warning font-medium">{cls.late}</TableCell>
                        <TableCell className="text-center text-destructive font-medium">{cls.absent}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={cn(
                              "font-semibold",
                              cls.rate >= 95
                                ? "bg-success/10 text-success"
                                : cls.rate >= 85
                                  ? "bg-warning/10 text-warning"
                                  : "bg-destructive/10 text-destructive"
                            )}
                          >
                            {cls.rate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6 animate-fade-in">
            <Card className="shadow-card rounded-xl border-warning/30 bg-warning/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">Low Attendance Alerts</CardTitle>
                    <CardDescription>Students below 75% attendance threshold</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id || dept.code} value={dept.code}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl gap-2">
                <Download className="h-4 w-4" />
                Export List
              </Button>
            </div>

            {/* Low Attendance Students Table */}
            <Card className="shadow-card rounded-xl">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-center">Classes</TableHead>
                      <TableHead className="text-center">Attended</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                              <GraduationCap className="h-4 w-4 text-destructive" />
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{student.rollNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.department}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{student.classes}</TableCell>
                        <TableCell className="text-center">{student.attended}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={student.rate} className="h-2 w-16" />
                            <Badge className="bg-destructive/10 text-destructive font-semibold">
                              {student.rate}%
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success" />
                <p>No students with low attendance found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
