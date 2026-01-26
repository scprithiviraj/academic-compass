import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const mockStudents = [
  {
    id: "1",
    name: "Alice Johnson",
    rollNo: "CS2024001",
    email: "alice@university.edu",
    phone: "+1 234-567-8901",
    department: "Computer Science",
    semester: 4,
    attendance: 92,
    avgGrade: "A",
    activitiesCompleted: 15,
    xp: 2450,
    avatar: null,
    status: "active",
  },
  {
    id: "2",
    name: "Bob Smith",
    rollNo: "CS2024002",
    email: "bob@university.edu",
    phone: "+1 234-567-8902",
    department: "Computer Science",
    semester: 4,
    attendance: 68,
    avgGrade: "B",
    activitiesCompleted: 8,
    xp: 1200,
    avatar: null,
    status: "at-risk",
  },
  {
    id: "3",
    name: "Carol Davis",
    rollNo: "CS2024003",
    email: "carol@university.edu",
    phone: "+1 234-567-8903",
    department: "Computer Science",
    semester: 4,
    attendance: 88,
    avgGrade: "A-",
    activitiesCompleted: 12,
    xp: 1890,
    avatar: null,
    status: "active",
  },
  {
    id: "4",
    name: "David Lee",
    rollNo: "CS2024004",
    email: "david@university.edu",
    phone: "+1 234-567-8904",
    department: "Computer Science",
    semester: 4,
    attendance: 45,
    avgGrade: "C",
    activitiesCompleted: 3,
    xp: 450,
    avatar: null,
    status: "critical",
  },
  {
    id: "5",
    name: "Emma Wilson",
    rollNo: "CS2024005",
    email: "emma@university.edu",
    phone: "+1 234-567-8905",
    department: "Computer Science",
    semester: 4,
    attendance: 95,
    avgGrade: "A+",
    activitiesCompleted: 20,
    xp: 3200,
    avatar: null,
    status: "active",
  },
];

const attendanceHistory = [
  { month: "Aug", attendance: 95 },
  { month: "Sep", attendance: 88 },
  { month: "Oct", attendance: 92 },
  { month: "Nov", attendance: 85 },
  { month: "Dec", attendance: 78 },
  { month: "Jan", attendance: 82 },
];

const gradeDistribution = [
  { name: "A+", value: 15, color: "hsl(var(--success))" },
  { name: "A", value: 25, color: "hsl(var(--primary))" },
  { name: "B", value: 30, color: "hsl(var(--info))" },
  { name: "C", value: 20, color: "hsl(var(--warning))" },
  { name: "D/F", value: 10, color: "hsl(var(--destructive))" },
];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = mockStudents.filter((s) => s.status === "active").length;
  const atRiskCount = mockStudents.filter((s) => s.status === "at-risk").length;
  const criticalCount = mockStudents.filter((s) => s.status === "critical").length;

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
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">
            View and manage student profiles, attendance, and performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{mockStudents.length}</p>
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
            <CardTitle>Student List</CardTitle>
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
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {student.name.split(" ").map((n) => n[0]).join("")}
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
                                  <AvatarImage src={selectedStudent.avatar || undefined} />
                                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                    {selectedStudent.name.split(" ").map((n) => n[0]).join("")}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
