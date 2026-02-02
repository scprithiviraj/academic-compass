import { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WeeklyCalendar } from "@/components/schedule/WeeklyCalendar";
import { DayScheduleList } from "@/components/schedule/DayScheduleList";
import { ClassDetailSheet } from "@/components/schedule/ClassDetailSheet";
import { FreePeriodSheet } from "@/components/schedule/FreePeriodSheet";
import { ScheduleClass } from "@/types/schedule";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Coffee,
  Target,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { studentService } from "@/services/student.service";

const COLORS = ["bg-primary", "bg-secondary", "bg-accent", "bg-info", "bg-success", "bg-warning", "bg-destructive"];

interface AttendanceStats {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<ScheduleClass | null>(null);
  const [selectedFreePeriod, setSelectedFreePeriod] = useState<ScheduleClass | null>(null);
  const [schedule, setSchedule] = useState<ScheduleClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AttendanceStats | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);
        const [scheduleData, statsData] = await Promise.all([
          studentService.getWeeklySchedule(user.userId),
          studentService.getAttendanceStats(user.userId)
        ]);

        setStats(statsData);

        // Fetch attendance for the current week range
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
        const weekEnd = addWeeks(weekStart, 1);
        const startStr = format(weekStart, "yyyy-MM-dd");
        const endOfWeekDate = new Date(weekStart);
        endOfWeekDate.setDate(endOfWeekDate.getDate() + 6);
        const endStr = format(endOfWeekDate, "yyyy-MM-dd");

        let attendanceRecords: any[] = [];
        try {
          attendanceRecords = await studentService.getAttendanceByRange(user.userId, startStr, endStr);
        } catch (e) {
          console.error("Failed to fetch attendance records", e);
        }

        // Map backend data to frontend model
        const mappedSchedule: ScheduleClass[] = scheduleData.map((item, index) => {
          const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const dayIndex = days.indexOf(item.dayOfWeek); // 0-6 (Sunday is 0)

          let dayOffset = dayIndex - 1; // Mon(1)->0, Tue(2)->1... Sun(0)->-1
          if (dayOffset < 0) dayOffset = 6;

          const specificDate = new Date(weekStart);
          specificDate.setDate(specificDate.getDate() + dayOffset);
          const specificDateStr = format(specificDate, "yyyy-MM-dd");

          const attendance = attendanceRecords.find(att => {
            const attDate = att.session?.date;
            const attCourseId = att.session?.course?.courseId;
            const attStartTime = att.session?.startTime; // HH:mm:ss

            if (attDate !== specificDateStr) return false;
            // Loose comparison for courseId in case types differ (string vs number)
            if (String(attCourseId) !== String(item.courseId)) return false;

            // Normalize times "10:00:00" vs "10:00"
            const itemStart = item.startTime.substring(0, 5); // 10:00
            const attStart = attStartTime ? attStartTime.substring(0, 5) : "";

            // If attendance has time, match it. If not, assume date/course match is enough (legacy)
            if (attStart && attStart !== itemStart) return false;

            return true;
          });

          // Calculate status based on Time AND Day
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();

          const [startH, startM] = item.startTime.split(':').map(Number);
          const [endH, endM] = item.endTime.split(':').map(Number);
          const startTimeMins = startH * 60 + startM;
          const endTimeMins = endH * 60 + endM;

          let status: "upcoming" | "ongoing" | "completed" | "free" | "cancelled" = "upcoming";

          const isPastDate = specificDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const isToday = specificDate.getDate() === now.getDate() &&
            specificDate.getMonth() === now.getMonth() &&
            specificDate.getFullYear() === now.getFullYear();

          // Check for Free Period
          if (attendance?.session?.method === 'FREE_PERIOD') {
            status = 'free';
          } else if (isPastDate) {
            status = "completed";
          } else if (isToday) {
            if (currentTime > endTimeMins) status = "completed";
            else if (currentTime >= startTimeMins && currentTime <= endTimeMins) status = "ongoing";
            else status = "upcoming";
          } else {
            status = "upcoming";
          }

          return {
            id: item.slotId.toString(),
            subject: item.subject,
            faculty: item.teacherName || "Unknown",
            room: item.roomNumber,
            startTime: item.startTime.substring(0, 5),
            endTime: item.endTime.substring(0, 5),
            status: status,
            color: COLORS[index % COLORS.length],
            day: dayIndex === 0 ? 7 : dayIndex,
            attendanceStatus: attendance ? attendance.status : null
          };
        });
        setSchedule(mappedSchedule);
      } catch (error) {
        console.error("Failed to fetch schedule", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user, selectedDate]);



  // Calculate stats
  const totalClasses = schedule.length;
  // Count free periods based on status 'free' which comes from backend 'FREE_PERIOD'
  const freePeriods = schedule.filter((c) => c.status === "free").length;
  const totalHours = schedule.reduce((acc, c) => {
    const start = parseInt(c.startTime.split(":")[0]) * 60 + parseInt(c.startTime.split(":")[1]);
    const end = parseInt(c.endTime.split(":")[0]) * 60 + parseInt(c.endTime.split(":")[1]);
    return acc + (end - start);
  }, 0);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              My Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              View your classes and manage your time effectively
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-4 animate-fade-in stagger-1" style={{ opacity: 0 }}>
          <Card className="shadow-card rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClasses}</p>
                <p className="text-xs text-muted-foreground">Classes/Week</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Coffee className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{freePeriods}</p>
                <p className="text-xs text-muted-foreground">Free Periods</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(totalHours / 60)}h</p>
                <p className="text-xs text-muted-foreground">Total Hours</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats ? `${stats.percentage}%` : "0%"}</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Section */}
        <div className="space-y-4">
          <Card className="shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-semibold ml-2">
                  {`Week of ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`}
                </h2>
              </div>

            </CardHeader>
            <CardContent>
              <WeeklyCalendar
                selectedDate={selectedDate}
                schedule={schedule}
                onClassClick={setSelectedClass}
                onFreePeriodClick={setSelectedFreePeriod}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Sheets */}
      <ClassDetailSheet
        classItem={selectedClass}
        isOpen={!!selectedClass}
        onClose={() => setSelectedClass(null)}
      />
      <FreePeriodSheet
        classItem={selectedFreePeriod}
        isOpen={!!selectedFreePeriod}
        onClose={() => setSelectedFreePeriod(null)}
      />
    </DashboardLayout >
  );
}
