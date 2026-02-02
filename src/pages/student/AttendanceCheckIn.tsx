import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QRScanner } from "@/components/attendance/QRScanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  TrendingUp,
  AlertTriangle,
  History,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { studentService } from "@/services/student.service";

interface RecentAttendanceRecord {
  attendanceId: number;
  studentName: string;
  status: string;
  markedTime: string;
  courseName: string;
  date: string;
}

interface AttendanceStats {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

import attendanceService from "@/services/attendance.service";

export default function AttendanceCheckIn() {
  const { user } = useAuth();
  const [lastCheckIn, setLastCheckIn] = useState<{ subject: string; time: string } | null>(null);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<RecentAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);

      const allRecords = await attendanceService.getStudentAttendance(user.userId) as any[];

      // Calculate Stats
      const total = allRecords.length;
      const present = allRecords.filter(r => r.status === 'PRESENT').length;
      const late = allRecords.filter(r => r.status === 'LATE').length;
      const absent = allRecords.filter(r => r.status === 'ABSENT').length;
      const percentage = total > 0 ? ((present + late) / total) * 100 : 0;

      setStats({
        totalClasses: total,
        present,
        late,
        absent,
        percentage
      });

      const recent = allRecords
        .sort((a, b) => {
          const dateA = a.session?.date ? new Date(a.session.date + 'T' + (a.markedTime || '00:00:00')).getTime() : 0;
          const dateB = b.session?.date ? new Date(b.session.date + 'T' + (b.markedTime || '00:00:00')).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 6)
        .map(r => ({
          attendanceId: r.attendanceId,
          studentName: r.user?.name || "",
          status: r.status,
          markedTime: r.markedTime,
          courseName: r.session?.course?.courseName || "Unknown Course",
          date: r.session?.date || ""
        }));

      setRecentAttendance(recent);

    } catch (error) {
      console.error("Failed to fetch attendance data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleScanSuccess = (data: { subject?: string }) => {
    setLastCheckIn({
      subject: data.subject || "Unknown",
      time: new Date().toLocaleTimeString(),
    });
    // Refresh data after successful scan
    setTimeout(fetchData, 1000);
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PRESENT":
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Present" };
      case "ABSENT":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Absent" };
      case "LATE":
        return { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Late" };
      default:
        return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: status };
    }
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Attendance Check-In
          </h1>
          <p className="text-muted-foreground mt-1">
            Scan QR code or enter manual code to mark your attendance
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* QR Scanner */}
          <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <QRScanner
              onScanSuccess={handleScanSuccess}
              studentId={user?.userId?.toString() || "Unknown"}
              studentName={user?.name || user?.email || "Student"}
            />
          </div>

          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="shadow-card rounded-xl animate-fade-in stagger-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Overall Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">{Math.round(stats?.percentage || 0)}%</span>
                  <span className="text-sm text-muted-foreground">This semester</span>
                </div>
                <Progress value={stats?.percentage || 0} className={`mt-3 h-2 ${(stats?.percentage || 0) >= 75 ? "bg-success/20 [&>div]:bg-success" :
                  (stats?.percentage || 0) >= 60 ? "bg-warning/20 [&>div]:bg-warning" : "bg-destructive/20 [&>div]:bg-destructive"
                  }`} />
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                  <div>
                    <span className="block font-medium text-foreground">{stats?.present || 0}</span>
                    Present
                  </div>
                  <div>
                    <span className="block font-medium text-foreground">{stats?.late || 0}</span>
                    Late
                  </div>
                  <div>
                    <span className="block font-medium text-foreground">{stats?.absent || 0}</span>
                    Absent
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card className="shadow-card rounded-xl animate-fade-in stagger-3" style={{ opacity: 0 }}>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Attendance
                </CardTitle>
                <CardDescription>Your last 6 attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : recentAttendance.length > 0 ? (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin pr-2">
                    {recentAttendance
                      .map((record) => {
                        const statusConfig = getStatusConfig(record.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <div
                            key={record.attendanceId}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm bg-background hover:bg-muted/30 border-border`}
                          >
                            <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{record.courseName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{new Date(record.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{record.markedTime}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="outline"
                                className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs`}
                              >
                                {statusConfig.label}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No recent attendance records found.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
