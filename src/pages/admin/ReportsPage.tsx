import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  Filter,
  BarChart3,
  Users,
  ClipboardCheck,
  TrendingUp,
  FileSpreadsheet,
  Printer,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const attendanceTrendData = [
  { month: "Sep", rate: 88 },
  { month: "Oct", rate: 91 },
  { month: "Nov", rate: 87 },
  { month: "Dec", rate: 85 },
  { month: "Jan", rate: 92 },
];

const departmentPerformance = [
  { name: "Computer Science", attendance: 94, activities: 156, avgGrade: 85 },
  { name: "Engineering", attendance: 89, activities: 132, avgGrade: 82 },
  { name: "Business", attendance: 91, activities: 98, avgGrade: 78 },
  { name: "Arts", attendance: 86, activities: 76, avgGrade: 80 },
];

const activityCompletionData = [
  { week: "Week 1", completed: 45, pending: 12 },
  { week: "Week 2", completed: 52, pending: 8 },
  { week: "Week 3", completed: 38, pending: 15 },
  { week: "Week 4", completed: 61, pending: 5 },
];

const userGrowthData = [
  { month: "Aug", students: 2400, faculty: 140 },
  { month: "Sep", students: 2650, faculty: 148 },
  { month: "Oct", students: 2720, faculty: 152 },
  { month: "Nov", students: 2780, faculty: 154 },
  { month: "Dec", students: 2800, faculty: 155 },
  { month: "Jan", students: 2847, faculty: 156 },
];

const recentReports = [
  { id: 1, name: "Monthly Attendance Summary", type: "Attendance", date: "2025-01-20", status: "Ready" },
  { id: 2, name: "Department Performance Q4", type: "Performance", date: "2025-01-18", status: "Ready" },
  { id: 3, name: "Student Activity Report", type: "Activities", date: "2025-01-15", status: "Ready" },
  { id: 4, name: "Faculty Workload Analysis", type: "Faculty", date: "2025-01-10", status: "Ready" },
  { id: 5, name: "Curriculum Coverage Report", type: "Curriculum", date: "2025-01-05", status: "Ready" },
];

const pieData = [
  { name: "Excellent (>90%)", value: 35, color: "hsl(152, 69%, 41%)" },
  { name: "Good (75-90%)", value: 45, color: "hsl(217, 91%, 60%)" },
  { name: "Average (60-75%)", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "Poor (<60%)", value: 5, color: "hsl(0, 84%, 60%)" },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("all");

  const handleExport = (format: string) => {
    console.log(`Exporting report as ${format}`);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Generate and view comprehensive analytics reports
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" className="rounded-xl" onClick={() => handleExport("pdf")}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button className="rounded-xl gradient-primary shadow-primary" onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Attendance</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.4%</div>
              <p className="text-xs text-success">+2.3% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,003</div>
              <p className="text-xs text-success">+156 new this semester</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activities Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,847</div>
              <p className="text-xs text-success">+324 this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-lg">Attendance</TabsTrigger>
            <TabsTrigger value="activities" className="rounded-lg">Activities</TabsTrigger>
            <TabsTrigger value="saved" className="rounded-lg">Saved Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Attendance Trend */}
              <Card className="shadow-card rounded-xl">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Attendance Trend</CardTitle>
                  <CardDescription>Monthly attendance rate overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={attendanceTrendData}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
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
                        dataKey="rate"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={2}
                        fill="url(#colorRate)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Student Performance Distribution */}
              <Card className="shadow-card rounded-xl">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Performance Distribution</CardTitle>
                  <CardDescription>Students by attendance category</CardDescription>
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
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground truncate">{item.name}</span>
                        <span className="font-medium ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Growth Chart */}
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">User Growth</CardTitle>
                <CardDescription>Students and faculty enrollment over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <YAxis yAxisId="left" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="students" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="faculty" stroke="hsl(152, 69%, 41%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Department Performance</CardTitle>
                <CardDescription>Attendance and activity metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-center">Attendance Rate</TableHead>
                      <TableHead className="text-center">Activities</TableHead>
                      <TableHead className="text-center">Avg Grade</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentPerformance.map((dept) => (
                      <TableRow key={dept.name}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={dept.attendance >= 90 ? "default" : "secondary"}>
                            {dept.attendance}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{dept.activities}</TableCell>
                        <TableCell className="text-center">{dept.avgGrade}%</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Activity Completion Trend</CardTitle>
                <CardDescription>Weekly activity completion statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={activityCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="week" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="completed" fill="hsl(152, 69%, 41%)" radius={[4, 4, 0, 0]} name="Completed" />
                    <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Reports Tab */}
          <TabsContent value="saved" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display text-lg">Saved Reports</CardTitle>
                  <CardDescription>Previously generated reports</CardDescription>
                </div>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="activities">Activities</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports
                      .filter((r) => reportType === "all" || r.type.toLowerCase() === reportType)
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.type}</Badge>
                          </TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-success">
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
