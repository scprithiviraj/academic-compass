import { useState } from "react";
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
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  subject: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
}

const recentAttendance: AttendanceRecord[] = [
  { id: "1", subject: "Data Structures", date: "Today", time: "09:02 AM", status: "present" },
  { id: "2", subject: "Algorithms", date: "Today", time: "11:15 AM", status: "late" },
  { id: "3", subject: "Database Systems", date: "Yesterday", time: "09:00 AM", status: "present" },
  { id: "4", subject: "Computer Networks", date: "Yesterday", time: "-", status: "absent" },
  { id: "5", subject: "Data Structures", date: "2 days ago", time: "09:01 AM", status: "present" },
];

const attendanceStats = {
  totalClasses: 45,
  attended: 38,
  late: 3,
  absent: 4,
  percentage: 91,
};

export default function AttendanceCheckIn() {
  const [lastCheckIn, setLastCheckIn] = useState<{ subject: string; time: string } | null>(null);

  const handleScanSuccess = (data: { subject?: string }) => {
    setLastCheckIn({
      subject: data.subject || "Unknown",
      time: new Date().toLocaleTimeString(),
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "present":
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" };
      case "late":
        return { icon: Clock, color: "text-warning", bg: "bg-warning/10" };
      case "absent":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" };
      default:
        return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" };
    }
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
              studentId="CS2021001"
              studentName="John Doe"
            />
          </div>

          <div className="space-y-6">
            {/* Attendance Stats */}
            <Card className="shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Attendance
                </CardTitle>
                <CardDescription>Current semester statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Attendance</span>
                    <span
                      className={`text-2xl font-bold ${
                        attendanceStats.percentage >= 75 ? "text-success" : "text-warning"
                      }`}
                    >
                      {attendanceStats.percentage}%
                    </span>
                  </div>
                  <Progress
                    value={attendanceStats.percentage}
                    className="h-3"
                  />
                  {attendanceStats.percentage < 75 && (
                    <div className="flex items-center gap-2 text-sm text-warning">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Below 75% threshold - attend more classes!</span>
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-2xl font-bold">{attendanceStats.totalClasses}</p>
                    <p className="text-xs text-muted-foreground">Total Classes</p>
                  </div>
                  <div className="p-4 rounded-xl bg-success/10 text-center">
                    <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-success" />
                    <p className="text-2xl font-bold text-success">{attendanceStats.attended}</p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                  <div className="p-4 rounded-xl bg-warning/10 text-center">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-warning" />
                    <p className="text-2xl font-bold text-warning">{attendanceStats.late}</p>
                    <p className="text-xs text-muted-foreground">Late</p>
                  </div>
                  <div className="p-4 rounded-xl bg-destructive/10 text-center">
                    <XCircle className="h-5 w-5 mx-auto mb-2 text-destructive" />
                    <p className="text-2xl font-bold text-destructive">{attendanceStats.absent}</p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card className="shadow-card rounded-xl animate-fade-in stagger-3" style={{ opacity: 0 }}>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin pr-2">
                  {recentAttendance.map((record) => {
                    const statusConfig = getStatusConfig(record.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={record.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${statusConfig.bg}`}
                      >
                        <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{record.subject}</p>
                          <p className="text-xs text-muted-foreground">{record.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs`}
                          >
                            {record.status}
                          </Badge>
                          {record.time !== "-" && (
                            <p className="text-xs text-muted-foreground mt-1">{record.time}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
