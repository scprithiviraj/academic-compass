import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import mentorService, { MentorProfile, MentorStudentSummary } from "@/services/mentor.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [mentees, setMentees] = useState<MentorStudentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const profile = await mentorService.getMentorProfile(user!.userId);
      setMentorProfile(profile);
      if (profile) {
        const students = await mentorService.getAssignedStudents(profile.mentorId);
        setMentees(students);
      }
    } catch (e) {
      console.error("Failed to load mentor data", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="faculty">
        <div className="flex items-center justify-center h-full">
          <p>Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!mentorProfile) {
    return (
      <DashboardLayout role="faculty">
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not a Mentor</AlertTitle>
            <AlertDescription>
              You are not registered as a mentor. Please go to the Students page to register.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  // Analytics Calculations
  const totalStudents = mentees.length;
  const avgAttendance =
    totalStudents > 0
      ? Math.round(
        mentees.reduce((acc, curr) => acc + curr.attendancePercentage, 0) /
        totalStudents
      )
      : 0;

  const totalActivities = mentees.reduce((acc, curr) => acc + curr.activitiesCompleted, 0);
  const avgActivities = totalStudents > 0 ? Math.round(totalActivities / totalStudents) : 0;

  const atRiskCount = mentees.filter((s) => s.status === "at-risk" || s.status === "critical").length;

  // Chart Data preparation
  const attendanceData = mentees.map(s => ({
    name: s.name,
    attendance: s.attendancePercentage
  }));

  const statusDistribution = [
    { name: 'Active', value: mentees.filter(s => s.status === 'active').length, color: '#22c55e' },
    { name: 'At Risk', value: mentees.filter(s => s.status === 'at-risk').length, color: '#f59e0b' },
    { name: 'Critical', value: mentees.filter(s => s.status === 'critical').length, color: '#ef4444' },
  ];

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Mentor Analytics</h1>
          <p className="text-muted-foreground">
            Performance overview for your {totalStudents} mentees
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Mentees</p>
                <h3 className="text-2xl font-bold">{totalStudents}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                <h3 className="text-2xl font-bold">{avgAttendance}%</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Activities</p>
                <h3 className="text-2xl font-bold">{avgActivities}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <h3 className="text-2xl font-bold">{atRiskCount}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance by Student Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Student</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Student Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {statusDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-muted-foreground">{entry.name}</span>
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
