import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import mentorService, { MentorProfile, MentorStudentSummary, MentorStudentAnalyticsDetail, StudentAttendanceAnalytics } from "@/services/mentor.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, Users, CheckCircle, Clock, BookOpen, Calendar, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

export default function FacultyAnalyticsPage() {
    const { user } = useAuth();
    const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
    const [mentees, setMentees] = useState<MentorStudentSummary[]>([]);
    const [detailedAnalytics, setDetailedAnalytics] = useState<MentorStudentAnalyticsDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<MentorStudentAnalyticsDetail | null>(null);
    const [attendanceAnalytics, setAttendanceAnalytics] = useState<StudentAttendanceAnalytics | null>(null);

    useEffect(() => {
        if (user?.userId) {
            loadData();
        }
    }, [user]);

    useEffect(() => {
        if (selectedStudent) {
            setAttendanceAnalytics(null);
            mentorService.getStudentAnalytics(selectedStudent.studentId)
                .then(setAttendanceAnalytics)
                .catch(err => console.error("Failed to fetch student analytics", err));
        }
    }, [selectedStudent]);

    const loadData = async () => {
        try {
            setLoading(true);
            const profile = await mentorService.getMentorProfile(user!.userId);
            setMentorProfile(profile);
            if (profile) {
                const students = await mentorService.getAssignedStudents(profile.mentorId);
                setMentees(students);

                // Fetch detailed analytics
                const details = await mentorService.getMentorStudentAnalyticsDetail(profile.mentorId);
                setDetailedAnalytics(details);
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

                {/* Student List for Details */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Student Details</h2>
                    <p className="text-muted-foreground mb-6">Click on a student card to view robust performance analytics.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {detailedAnalytics.map((student) => (
                            <Card
                                key={student.studentId}
                                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                                onClick={() => setSelectedStudent(student)}
                            >
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <CardTitle className="text-base truncate">{student.name}</CardTitle>
                                        <CardDescription className="truncate">{student.rollNo}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Dept</span>
                                        <span className="font-medium">{student.department}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Activity Progress</span>
                                            <span className="font-medium">{student.activityCompletionPercentage}%</span>
                                        </div>
                                        <Progress value={student.activityCompletionPercentage} className="h-1.5" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {detailedAnalytics.length === 0 && (
                            <div className="col-span-full text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                                No students found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Student Modal */}
                <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        {selectedStudent && (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                                            {selectedStudent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <DialogTitle className="text-2xl">{selectedStudent.name}</DialogTitle>
                                            <DialogDescription className="text-base mt-1">
                                                {selectedStudent.rollNo} • {selectedStudent.department}
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    {/* Activity Section */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
                                            <TrendingUp className="h-5 w-5 text-primary" />
                                            Activity Status
                                        </h4>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                                <p className="text-2xl font-bold text-green-600">{selectedStudent.completedActivities}</p>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Completed</p>
                                            </div>
                                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                <p className="text-2xl font-bold text-blue-600">{selectedStudent.ongoingActivities}</p>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Ongoing</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <p className="text-2xl font-bold text-gray-600">{selectedStudent.totalEnrolledActivities}</p>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total</p>
                                            </div>
                                        </div>

                                        <div className="bg-secondary/30 p-4 rounded-xl space-y-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium">Overall Completion</span>
                                                <span className="text-sm font-bold">{selectedStudent.activityCompletionPercentage}%</span>
                                            </div>
                                            <Progress value={selectedStudent.activityCompletionPercentage} className="h-2" />
                                        </div>
                                    </div>

                                    {/* Timetable Section */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            Today's Schedule
                                        </h4>
                                        {selectedStudent.todayClasses.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedStudent.todayClasses.map((cls, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                        <div>
                                                            <p className="font-medium text-base">{cls.subject}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="outline" className="text-xs font-normal">
                                                                    {cls.startTime.substring(0, 5)} - {cls.endTime.substring(0, 5)}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <Badge variant={
                                                                cls.status === 'COMPLETED' ? 'secondary' :
                                                                    cls.status === 'ONGOING' ? 'default' : 'outline'
                                                            } className={cls.status === 'ONGOING' ? 'animate-pulse' : ''}>
                                                                {cls.status}
                                                            </Badge>

                                                            {cls.status !== 'UPCOMING' && (
                                                                <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cls.attendanceStatus === 'PRESENT' ? 'bg-green-100 text-green-700' :
                                                                        cls.attendanceStatus === 'ABSENT' ? 'bg-red-100 text-red-700' :
                                                                            'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                    {cls.attendanceStatus === 'PRESENT' && <CheckCircle className="h-3 w-3" />}
                                                                    {cls.attendanceStatus === 'PRESENT' ? 'Present' :
                                                                        cls.attendanceStatus === 'ABSENT' ? 'Absent' : 'Not Marked'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-xl">
                                                <Clock className="h-10 w-10 mb-2 opacity-20" />
                                                <p>No classes scheduled today</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Subject Wise Attendance Section */}
                                    <div className="col-span-1 md:col-span-2 space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                            Subject Wise Attendance
                                        </h4>
                                        {attendanceAnalytics ? (
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={attendanceAnalytics.subjectWiseAttendance}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="subject" fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                                        <Tooltip />
                                                        <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Attendance %" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-32 text-muted-foreground">
                                                Loading attendance data...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}

