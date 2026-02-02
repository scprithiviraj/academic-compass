import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Trash2, UserPlus, Users, ChevronRight } from "lucide-react";
import adminService from "@/services/admin.service";
import mentorService, { MentorProfile, MentorStudentSummary } from "@/services/mentor.service";
import { toast } from "sonner";

export default function AdminMentorshipPage() {
    const [mentors, setMentors] = useState<MentorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
    const [mentees, setMentees] = useState<MentorStudentSummary[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [studentIdToAdd, setStudentIdToAdd] = useState("");

    useEffect(() => {
        loadMentors();
    }, []);

    const loadMentors = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllMentors();
            setMentors(data);
        } catch (e) {
            console.error("Failed to load mentors", e);
            toast.error("Failed to load mentors");
        } finally {
            setLoading(false);
        }
    };

    const handleViewMentor = async (mentor: MentorProfile) => {
        setSelectedMentor(mentor);
        setIsDetailOpen(true);
        loadMentees(mentor.mentorId);
    };

    const loadMentees = async (mentorId: number) => {
        try {
            const data = await mentorService.getAssignedStudents(mentorId);
            setMentees(data);
        } catch (e) {
            console.error("Failed to load mentees", e);
            toast.error("Failed to load mentees");
        }
    };

    const handleRemoveStudent = async (studentId: number) => {
        if (!selectedMentor) return;
        try {
            await adminService.removeStudentFromMentor(selectedMentor.mentorId, studentId);
            toast.success("Student removed successfully");
            loadMentees(selectedMentor.mentorId);
            loadMentors(); // Update counts
        } catch (e) {
            console.error(e);
            toast.error("Failed to remove student");
        }
    };

    const handleAddStudent = async () => {
        if (!selectedMentor || !studentIdToAdd) return;
        try {
            await mentorService.assignStudent(selectedMentor.mentorId, parseInt(studentIdToAdd));
            toast.success("Student assigned successfully");
            setIsAddStudentOpen(false);
            setStudentIdToAdd("");
            loadMentees(selectedMentor.mentorId);
            loadMentors(); // Update counts
        } catch (e: any) {
            console.error(e);
            toast.error(e.response?.data || "Failed to assign student");
        }
    };

    const filteredMentors = mentors.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mentorship Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage faculty mentors and student assignments
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Registered Mentors</CardTitle>
                                <CardDescription>
                                    List of all faculty members registered as mentors
                                </CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search mentors..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Students</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                Loading mentors...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredMentors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No mentors found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredMentors.map((mentor) => (
                                            <TableRow key={mentor.mentorId}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>{mentor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        {mentor.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{mentor.department}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {mentor.currentStudentCount} / {mentor.maxStudents}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={mentor.active ? "outline" : "destructive"}>
                                                        {mentor.active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewMentor(mentor)}
                                                    >
                                                        Manage <ChevronRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Mentor Detail Dialog */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle>{selectedMentor?.name}</DialogTitle>
                                    <DialogDescription>{selectedMentor?.department} Department</DialogDescription>
                                </div>
                                <Button size="sm" onClick={() => setIsAddStudentOpen(true)}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Student
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="mt-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Roll No</TableHead>
                                            <TableHead>Attendance</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mentees.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground">No students assigned</TableCell>
                                            </TableRow>
                                        ) : (
                                            mentees.map(student => (
                                                <TableRow key={student.studentId}>
                                                    <TableCell className="font-medium">{student.name}</TableCell>
                                                    <TableCell>{student.rollNo}</TableCell>
                                                    <TableCell>{student.attendancePercentage}%</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={
                                                                student.status === 'critical' ? 'bg-destructive/10 text-destructive' :
                                                                    student.status === 'at-risk' ? 'bg-warning/10 text-warning' :
                                                                        'bg-success/10 text-success'
                                                            }
                                                            variant="outline"
                                                        >
                                                            {student.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90" onClick={() => handleRemoveStudent(student.studentId)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Add Student Dialog */}
                <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Student</DialogTitle>
                            <DialogDescription>
                                Enter the Student ID to assign to {selectedMentor?.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <label className="text-sm font-medium">Student ID</label>
                            <Input
                                placeholder="e.g. 101"
                                value={studentIdToAdd}
                                onChange={(e) => setStudentIdToAdd(e.target.value)}
                                className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                For now, enter the numeric Database ID of the student.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddStudent} disabled={!studentIdToAdd}>Assign</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
