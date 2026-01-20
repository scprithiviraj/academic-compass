import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download,
  Filter,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  status: "present" | "absent" | "late";
  checkInTime?: string;
  avatar: string;
}

interface AttendanceListProps {
  classId?: string;
  className?: string;
  section?: string;
  date?: Date;
  students?: Student[];
}

const defaultStudents: Student[] = [
  { id: "1", name: "Alice Johnson", rollNo: "CS2021001", status: "present", checkInTime: "09:02", avatar: "AJ" },
  { id: "2", name: "Bob Smith", rollNo: "CS2021002", status: "present", checkInTime: "09:01", avatar: "BS" },
  { id: "3", name: "Charlie Brown", rollNo: "CS2021003", status: "absent", avatar: "CB" },
  { id: "4", name: "Diana Ross", rollNo: "CS2021004", status: "late", checkInTime: "09:15", avatar: "DR" },
  { id: "5", name: "Ethan Hunt", rollNo: "CS2021005", status: "present", checkInTime: "08:58", avatar: "EH" },
  { id: "6", name: "Fiona Green", rollNo: "CS2021006", status: "absent", avatar: "FG" },
  { id: "7", name: "George Miller", rollNo: "CS2021007", status: "present", checkInTime: "09:00", avatar: "GM" },
  { id: "8", name: "Hannah White", rollNo: "CS2021008", status: "present", checkInTime: "09:03", avatar: "HW" },
  { id: "9", name: "Ian Black", rollNo: "CS2021009", status: "late", checkInTime: "09:12", avatar: "IB" },
  { id: "10", name: "Julia Roberts", rollNo: "CS2021010", status: "present", checkInTime: "08:55", avatar: "JR" },
];

export function AttendanceList({
  className = "Data Structures",
  section = "CS-A",
  date = new Date(),
  students = defaultStudents,
}: AttendanceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const presentCount = students.filter((s) => s.status === "present").length;
  const lateCount = students.filter((s) => s.status === "late").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const attendancePercentage = Math.round(((presentCount + lateCount) / students.length) * 100);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "present":
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Present" };
      case "late":
        return { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Late" };
      case "absent":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Absent" };
      default:
        return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Unknown" };
    }
  };

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="font-display text-lg">
              {className} - Section {section}
            </CardTitle>
            <CardDescription>
              {date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </CardDescription>
          </div>
          <Button variant="outline" className="rounded-xl w-fit">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="p-4 rounded-xl bg-success/10 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold text-success">{presentCount}</p>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/10 text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold text-warning">{lateCount}</p>
            <p className="text-xs text-muted-foreground">Late</p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/10 text-center">
            <XCircle className="h-5 w-5 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold text-destructive">{absentCount}</p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </div>
        </div>

        {/* Attendance Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Attendance Rate</span>
            <span className="font-semibold flex items-center gap-1">
              {attendancePercentage >= 75 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
              {attendancePercentage}%
            </span>
          </div>
          <Progress value={attendancePercentage} className="h-2" />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Student List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
          {filteredStudents.map((student) => {
            const statusConfig = getStatusConfig(student.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={student.id}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${statusConfig.bg} border-transparent hover:border-border`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${statusConfig.bg} ${statusConfig.color} font-medium`}>
                    {student.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                </div>
                {student.checkInTime && (
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{student.checkInTime}</p>
                    <p className="text-xs text-muted-foreground">Check-in</p>
                  </div>
                )}
                <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 gap-1`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </Badge>
              </div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No students found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
