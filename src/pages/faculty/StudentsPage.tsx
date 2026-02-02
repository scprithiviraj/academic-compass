import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Search,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  Eye,
  Plus,
  UserPlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import mentorService, { MentorProfile, MentorStudentSummary } from "@/services/mentor.service";
import { toast } from "sonner"; // Assuming sonner is used, or alert
import { facultyService, StudentData } from "@/services/faculty.service";

// Mock data removed


const attendanceHistory = [
  { month: "Aug", attendance: 95 },
  { month: "Sep", attendance: 88 },
  { month: "Oct", attendance: 92 },
  { month: "Nov", attendance: 85 },
  { month: "Dec", attendance: 78 },
  { month: "Jan", attendance: 82 },
];

export default function StudentsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Mentor State
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [mentees, setMentees] = useState<MentorStudentSummary[]>([]);
  const [activeStudents, setActiveStudents] = useState<StudentData[]>([]); // For "All Students"
  const [viewMode, setViewMode] = useState<"all" | "mentees">("all");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  const loadAllStudents = async (userId: number) => {
    try {
      const data = await facultyService.getFacultyStudents(userId);
      setActiveStudents(data);
    } catch (e) {
      console.error("Failed to load students", e);
    }
  };

  const loadMentees = async (mentorId: number) => {
    try {
      const data = await mentorService.getAssignedStudents(mentorId);
      setMentees(data);
    } catch (e) {
      console.error("Failed to load mentees", e);
    }
  };

  const loadMentorProfile = async () => {
    try {
      const profile = await mentorService.getMentorProfile(user!.userId);
      setMentorProfile(profile);
      if (profile) {
        loadMentees(profile.mentorId);
        setViewMode("mentees"); // Default to mentees if mentor
      }
    } catch (e) {
      console.log("Not a mentor yet");
    }
  };

  useEffect(() => {
    if (user?.userId) {
      loadMentorProfile();
      loadAllStudents(user.userId);
    }
  }, [user]);

  const handleRegisterMentor = async () => {
    try {
      if (user?.teacherId) {
        const profile = await mentorService.registerAsMentor(user.teacherId, 20, 'staff');
        setMentorProfile(profile);
        setIsRegisterDialogOpen(false);
        loadMentees(profile.mentorId);
      } else if (user?.userId) {
        const profile = await mentorService.registerAsMentor(user.userId, 20, 'user');
        setMentorProfile(profile);
        setIsRegisterDialogOpen(false);
        loadMentees(profile.mentorId);
      } else {
        alert("Cannot register: User ID not found.");
      }
    } catch (e) {
      console.error(e);
      // toast.error("Failed to register");
    }
  };

  const handleAssignStudent = async (studentId: string) => {
    if (!mentorProfile) return;
    try {
      await mentorService.assignStudent(mentorProfile.mentorId, parseInt(studentId));
      // toast.success("Student assigned!");
      loadMentees(mentorProfile.mentorId);
    } catch (e) {
      console.error(e);
      // toast.error("Failed to assign student");
    }
  }

  // Filter Logic
  // Normalize Mentees to match mockStudents shape partially for list rendering or use a common type
  // We will map mentees to a compatible structure or handle both in the list.

  const activeList = viewMode === "mentees" ? mentees.map(m => ({
    ...m,
    id: m.studentId.toString(),
    avgGrade: m.avgGrade || "N/A", // Ensure string
    attendance: m.attendancePercentage,
    phone: "N/A", // Not in summary
    semester: 0 // Not in summary
  })) : activeStudents.map(s => ({ ...s, id: s.id.toString(), semester: s.semester || 4, phone: s.phone || "N/A", avgGrade: s.avgGrade || "N/A" }));

  const filteredStudents = activeList.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = activeList.filter((s) => s.status === "active").length;
  const atRiskCount = activeList.filter((s) => s.status === "at-risk").length;
  const criticalCount = activeList.filter((s) => s.status === "critical").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case "at-risk":
        return <Badge className="bg-warning/10 text-warning border-warning/20">At Risk</Badge>;
      case "critical":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAttendanceBadge = (attendance: number) => {
    if (attendance >= 85) {
      return <Badge className="bg-success/10 text-success border-success/20">{attendance}%</Badge>;
    } else if (attendance >= 75) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">{attendance}%</Badge>;
    }
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20">{attendance}%</Badge>;
  };

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">
              View and manage student profiles, attendance, and performance
            </p>
          </div>
          {!mentorProfile ? (
            <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register as Mentor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Become a Mentor</DialogTitle>
                  <DialogDescription>
                    As a mentor, you can track specific students' progress and attendance.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>Are you sure you want to register as a mentor?</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleRegisterMentor}>Confirm Registration</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                Mentor Active
              </Badge>
              {/* Add Student to Mentees Button? */}
            </div>
          )}
        </div>

        {/* View Toggle */}
        {mentorProfile && (
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'all' | 'mentees')}>
            <TabsList>
              <TabsTrigger value="mentees">My Mentees</TabsTrigger>
              <TabsTrigger value="all">All Students</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total {viewMode === 'mentees' ? 'Mentees' : 'Students'}</p>
                <p className="text-2xl font-bold">{activeList.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-warning">{atRiskCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll number..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>{viewMode === 'mentees' ? 'My Mentees' : 'Student List'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Activities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.avatarUrl || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {student.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{student.rollNo}</TableCell>
                      <TableCell>{getAttendanceBadge(student.attendance)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.avgGrade}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{student.activitiesCompleted} completed</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* If in All Students mode and is Mentor, show Assign button */}
                          {viewMode === 'all' && mentorProfile && (
                            <Button size="sm" variant="ghost" onClick={() => handleAssignStudent(student.id)} title="Add to Mentees">
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedStudent(student)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Student Profile</DialogTitle>
                              </DialogHeader>
                              {selectedStudent && (
                                <div className="space-y-6">
                                  {/* Profile Header */}
                                  <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={selectedStudent.avatarUrl || undefined} />
                                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                        {selectedStudent.name.split(" ").map((n: string) => n[0]).join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                                      <p className="text-muted-foreground">{selectedStudent.rollNo}</p>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Mail className="h-4 w-4" />
                                          {selectedStudent.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Phone className="h-4 w-4" />
                                          {selectedStudent.phone}
                                        </span>
                                      </div>
                                    </div>
                                    {getStatusBadge(selectedStudent.status)}
                                  </div>

                                  {/* Quick Stats */}
                                  <div className="grid grid-cols-4 gap-4">
                                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                                      <Calendar className="h-5 w-5 mx-auto text-primary mb-1" />
                                      <p className="text-2xl font-bold">{selectedStudent.attendance}%</p>
                                      <p className="text-xs text-muted-foreground">Attendance</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                                      <BookOpen className="h-5 w-5 mx-auto text-info mb-1" />
                                      <p className="text-2xl font-bold">{selectedStudent.avgGrade}</p>
                                      <p className="text-xs text-muted-foreground">Avg Grade</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                                      <Award className="h-5 w-5 mx-auto text-warning mb-1" />
                                      <p className="text-2xl font-bold">{selectedStudent.activitiesCompleted}</p>
                                      <p className="text-xs text-muted-foreground">Activities</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                                      <TrendingUp className="h-5 w-5 mx-auto text-success mb-1" />
                                      <p className="text-2xl font-bold">{selectedStudent.xp}</p>
                                      <p className="text-xs text-muted-foreground">XP Points</p>
                                    </div>
                                  </div>

                                  {/* Attendance History Chart */}
                                  <div>
                                    <h4 className="font-medium mb-3">Attendance History</h4>
                                    <div className="h-48">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={attendanceHistory}>
                                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                          <XAxis dataKey="month" className="text-xs" />
                                          <YAxis domain={[0, 100]} className="text-xs" />
                                          <Tooltip />
                                          <Area
                                            type="monotone"
                                            dataKey="attendance"
                                            stroke="hsl(var(--primary))"
                                            fill="hsl(var(--primary))"
                                            fillOpacity={0.2}
                                          />
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1">
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Email
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                      Send Alert
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
