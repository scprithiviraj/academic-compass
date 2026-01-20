import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  MapPin,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Settings,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  lateThreshold: number; // minutes after start time
  subject: string;
  section: string;
}

interface TimeBasedAttendanceProps {
  timeSlots?: TimeSlot[];
  enableGeofence?: boolean;
  enableWifiValidation?: boolean;
}

const defaultTimeSlots: TimeSlot[] = [
  { id: "1", startTime: "09:00", endTime: "10:30", lateThreshold: 10, subject: "Data Structures", section: "CS-A" },
  { id: "2", startTime: "11:00", endTime: "12:30", lateThreshold: 10, subject: "Data Structures", section: "CS-B" },
  { id: "3", startTime: "14:00", endTime: "15:30", lateThreshold: 10, subject: "Algorithms", section: "CS-A" },
];

export function TimeBasedAttendance({
  timeSlots = defaultTimeSlots,
  enableGeofence = true,
  enableWifiValidation = true,
}: TimeBasedAttendanceProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoAttendance, setAutoAttendance] = useState(true);
  const [geofenceEnabled, setGeofenceEnabled] = useState(enableGeofence);
  const [wifiEnabled, setWifiEnabled] = useState(enableWifiValidation);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [attendanceLog, setAttendanceLog] = useState<
    { studentId: string; name: string; time: string; status: string }[]
  >([]);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentTimeString = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getTimeSlotStatus = (slot: TimeSlot) => {
    const now = currentTime;
    const [startHour, startMin] = slot.startTime.split(":").map(Number);
    const [endHour, endMin] = slot.endTime.split(":").map(Number);

    const slotStart = new Date(now);
    slotStart.setHours(startHour, startMin, 0, 0);

    const slotEnd = new Date(now);
    slotEnd.setHours(endHour, endMin, 0, 0);

    const lateTime = new Date(slotStart);
    lateTime.setMinutes(lateTime.getMinutes() + slot.lateThreshold);

    if (now < slotStart) return "upcoming";
    if (now >= slotStart && now <= slotEnd) {
      if (now <= lateTime) return "on-time";
      return "late-window";
    }
    return "completed";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "on-time":
        return { color: "text-success", bg: "bg-success/10", label: "On Time Window", icon: CheckCircle2 };
      case "late-window":
        return { color: "text-warning", bg: "bg-warning/10", label: "Late Window", icon: AlertTriangle };
      case "completed":
        return { color: "text-muted-foreground", bg: "bg-muted", label: "Completed", icon: CheckCircle2 };
      default:
        return { color: "text-primary", bg: "bg-primary/10", label: "Upcoming", icon: Timer };
    }
  };

  const getTimeProgress = (slot: TimeSlot) => {
    const now = currentTime;
    const [startHour, startMin] = slot.startTime.split(":").map(Number);
    const [endHour, endMin] = slot.endTime.split(":").map(Number);

    const slotStart = new Date(now);
    slotStart.setHours(startHour, startMin, 0, 0);

    const slotEnd = new Date(now);
    slotEnd.setHours(endHour, endMin, 0, 0);

    if (now < slotStart) return 0;
    if (now > slotEnd) return 100;

    const totalDuration = slotEnd.getTime() - slotStart.getTime();
    const elapsed = now.getTime() - slotStart.getTime();
    return Math.round((elapsed / totalDuration) * 100);
  };

  const startSession = (slotId: string) => {
    setActiveSession(slotId);
    toast({
      title: "Session Started",
      description: "Automatic attendance tracking is now active",
    });

    // Simulate some students checking in
    const mockStudents = [
      { studentId: "CS2021001", name: "Alice Johnson" },
      { studentId: "CS2021002", name: "Bob Smith" },
      { studentId: "CS2021005", name: "Ethan Hunt" },
    ];

    setTimeout(() => {
      setAttendanceLog((prev) => [
        ...prev,
        ...mockStudents.map((s) => ({
          ...s,
          time: new Date().toLocaleTimeString(),
          status: "present",
        })),
      ]);
    }, 1000);
  };

  const stopSession = () => {
    setActiveSession(null);
    toast({
      title: "Session Ended",
      description: `${attendanceLog.length} students marked present`,
    });
    setAttendanceLog([]);
  };

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Time-Based Attendance
            </CardTitle>
            <CardDescription>Automatic attendance based on class schedules</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-2xl font-mono font-bold text-primary">
            <Clock className="h-6 w-6" />
            {getCurrentTimeString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings */}
        <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Auto Attendance</span>
            </div>
            <Switch checked={autoAttendance} onCheckedChange={setAutoAttendance} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Geofence</span>
            </div>
            <Switch checked={geofenceEnabled} onCheckedChange={setGeofenceEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">WiFi Check</span>
            </div>
            <Switch checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Today's Schedule</h3>
          {timeSlots.map((slot) => {
            const status = getTimeSlotStatus(slot);
            const statusConfig = getStatusConfig(status);
            const progress = getTimeProgress(slot);
            const isActive = activeSession === slot.id;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-md"
                    : status === "on-time" || status === "late-window"
                    ? `border-transparent ${statusConfig.bg}`
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{slot.subject}</p>
                    <p className="text-sm text-muted-foreground">Section {slot.section}</p>
                  </div>
                  <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 gap-1`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Late after: +{slot.lateThreshold} min
                  </div>
                </div>

                {(status === "on-time" || status === "late-window") && (
                  <>
                    <Progress value={progress} className="h-2 mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{progress}% elapsed</span>
                      {!isActive ? (
                        <Button
                          size="sm"
                          className="rounded-lg gradient-primary"
                          onClick={() => startSession(slot.id)}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Session
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-lg"
                          onClick={stopSession}
                        >
                          <StopCircle className="mr-2 h-4 w-4" />
                          End Session
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Attendance Log */}
        {activeSession && attendanceLog.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Live Check-ins ({attendanceLog.length})
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {attendanceLog.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-success/5 border border-success/20 animate-fade-in"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="font-medium text-sm">{log.name}</span>
                    <span className="text-xs text-muted-foreground">{log.studentId}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
