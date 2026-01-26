import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Target,
  Award,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const attendanceTrend = [
  { week: "Week 1", attendance: 92, target: 85 },
  { week: "Week 2", attendance: 88, target: 85 },
  { week: "Week 3", attendance: 85, target: 85 },
  { week: "Week 4", attendance: 90, target: 85 },
  { week: "Week 5", attendance: 78, target: 85 },
  { week: "Week 6", attendance: 82, target: 85 },
  { week: "Week 7", attendance: 86, target: 85 },
  { week: "Week 8", attendance: 89, target: 85 },
];

const classComparison = [
  { name: "CS101", attendance: 88, performance: 82, engagement: 75 },
  { name: "CS201", attendance: 92, performance: 88, engagement: 85 },
  { name: "CS301", attendance: 78, performance: 75, engagement: 68 },
  { name: "CS401", attendance: 85, performance: 80, engagement: 78 },
];

const performanceDistribution = [
  { name: "Excellent", value: 25, color: "hsl(var(--success))" },
  { name: "Good", value: 35, color: "hsl(var(--primary))" },
  { name: "Average", value: 25, color: "hsl(var(--warning))" },
  { name: "Below Avg", value: 15, color: "hsl(var(--destructive))" },
];

const engagementMetrics = [
  { subject: "Attendance", A: 92, fullMark: 100 },
  { subject: "Assignments", A: 85, fullMark: 100 },
  { subject: "Participation", A: 78, fullMark: 100 },
  { subject: "Activities", A: 88, fullMark: 100 },
  { subject: "Quizzes", A: 82, fullMark: 100 },
];

const monthlyStats = [
  { month: "Aug", present: 450, absent: 50, late: 25 },
  { month: "Sep", present: 420, absent: 70, late: 35 },
  { month: "Oct", present: 440, absent: 55, late: 30 },
  { month: "Nov", present: 410, absent: 80, late: 40 },
  { month: "Dec", present: 380, absent: 100, late: 45 },
  { month: "Jan", present: 430, absent: 60, late: 35 },
];

const activityCompletion = [
  { category: "Coding", completed: 45, total: 60 },
  { category: "Research", completed: 28, total: 40 },
  { category: "Projects", completed: 18, total: 25 },
  { category: "Reading", completed: 35, total: 50 },
  { category: "Practice", completed: 52, total: 70 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("semester");

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Detailed insights into class performance and student engagement
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Attendance</p>
                  <p className="text-2xl font-bold">86.5%</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success">+2.3%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-muted-foreground">out of 156 total</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Performance</p>
                  <p className="text-2xl font-bold">B+</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-info" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success">+5%</span>
                <span className="text-muted-foreground">improvement</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Activities Done</p>
                  <p className="text-2xl font-bold">1,248</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-muted-foreground">this semester</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Attendance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="week" className="text-xs" />
                        <YAxis domain={[60, 100]} className="text-xs" />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="attendance"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                          name="Attendance %"
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke="hsl(var(--destructive))"
                          strokeDasharray="5 5"
                          name="Target"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyStats}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" stackId="a" fill="hsl(var(--success))" name="Present" />
                        <Bar dataKey="late" stackId="a" fill="hsl(var(--warning))" name="Late" />
                        <Bar dataKey="absent" stackId="a" fill="hsl(var(--destructive))" name="Absent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Class Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classComparison} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" domain={[0, 100]} className="text-xs" />
                        <YAxis dataKey="name" type="category" className="text-xs" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendance" fill="hsl(var(--primary))" name="Attendance" />
                        <Bar dataKey="performance" fill="hsl(var(--success))" name="Performance" />
                        <Bar dataKey="engagement" fill="hsl(var(--info))" name="Engagement" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {performanceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={engagementMetrics}>
                        <PolarGrid className="stroke-muted" />
                        <PolarAngleAxis dataKey="subject" className="text-xs" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                        <Radar
                          name="Score"
                          dataKey="A"
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

              {/* Engagement Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {engagementMetrics.map((metric) => (
                    <div key={metric.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.subject}</span>
                        <span className="text-sm text-muted-foreground">{metric.A}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${metric.A}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Completion by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityCompletion}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="category" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
                      <Bar dataKey="total" fill="hsl(var(--muted))" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {activityCompletion.map((activity) => (
                <Card key={activity.category}>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">{activity.category}</p>
                    <p className="text-2xl font-bold mt-1">
                      {Math.round((activity.completed / activity.total) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.completed}/{activity.total} completed
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
