import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodayClass, facultyService, CourseStudent } from "@/services/faculty.service";
import { useToast } from "@/hooks/use-toast";

interface AttendanceListProps {
  classes: TodayClass[];
  isLoading?: boolean;
}

interface AttendanceStatus {
  [userId: number]: 'PRESENT' | 'ABSENT' | null;
}

export function AttendanceList({ classes, isLoading = false }: AttendanceListProps) {
  const [selectedClass, setSelectedClass] = useState<number>(classes[0]?.id || 0);
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({});
  const [sessionId, setSessionId] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;

      try {
        setIsLoadingStudents(true);
        const data = await facultyService.getCourseStudents(selectedClass);
        setStudents(data);
        // Reset attendance status
        setAttendanceStatus({});
      } catch (error: any) {
        console.error('Error fetching students:', error);
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedClass, toast]);

  // Generate session when class is selected
  useEffect(() => {
    const generateSession = async () => {
      if (!selectedClass) return;

      try {
        const response = await facultyService.generateQRCode(selectedClass);
        setSessionId(response.sessionId);
      } catch (error: any) {
        console.error('Error generating session:', error);
      }
    };

    generateSession();
  }, [selectedClass]);

  const markAttendance = async (userId: number, status: 'PRESENT' | 'ABSENT') => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Session not initialized",
        variant: "destructive",
      });
      return;
    }

    try {
      await facultyService.markAttendanceManual(sessionId, userId, status);
      setAttendanceStatus(prev => ({ ...prev, [userId]: status }));
      toast({
        title: "Attendance Marked",
        description: `Student marked as ${status.toLowerCase()}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  const selectedClassData = classes.find((c) => c.id === selectedClass);

  // Calculate attendance stats
  const totalStudents = students.length;
  const markedCount = Object.keys(attendanceStatus).length;
  const presentCount = Object.values(attendanceStatus).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(attendanceStatus).filter(s => s === 'ABSENT').length;
  const progressPercentage = totalStudents > 0 ? (markedCount / totalStudents) * 100 : 0;

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="font-display text-lg">Manual Attendance</CardTitle>
            <CardDescription>Mark attendance for students manually</CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit">
            {markedCount}/{totalStudents} marked
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No classes scheduled for today</p>
          </div>
        ) : (
          <>
            {/* Class Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Class</label>
              <Select value={selectedClass.toString()} onValueChange={(v) => setSelectedClass(parseInt(v))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.subject} - {cls.section} ({cls.time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Class Info */}
            {selectedClassData && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{students.length} students enrolled</span>
                </div>
                <Badge variant="outline">{selectedClassData.section}</Badge>
              </div>
            )}

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-success/10 text-center">
                <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="p-4 rounded-xl bg-destructive/10 text-center">
                <XCircle className="h-5 w-5 mx-auto mb-2 text-destructive" />
                <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Attendance Progress</span>
                <span className="font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Student List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-2">
              {isLoadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students enrolled
                </div>
              ) : (
                students.map((student) => {
                  const status = attendanceStatus[student.userId];
                  return (
                    <div
                      key={student.userId}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${status === 'PRESENT' ? 'bg-success/10 border-success/20' :
                          status === 'ABSENT' ? 'bg-destructive/10 border-destructive/20' :
                            'bg-muted/50 border-transparent hover:border-border'
                        }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={status === 'PRESENT' ? 'default' : 'outline'}
                          className={status === 'PRESENT' ? 'bg-success hover:bg-success/90' : ''}
                          onClick={() => markAttendance(student.userId, 'PRESENT')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={status === 'ABSENT' ? 'default' : 'outline'}
                          className={status === 'ABSENT' ? 'bg-destructive hover:bg-destructive/90' : ''}
                          onClick={() => markAttendance(student.userId, 'ABSENT')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
