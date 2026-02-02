import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import adminService from "@/services/admin.service";
import { Student } from "@/data/curriculum";
import { Loader2, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EnrollmentManagerProps {
    courses: any[]; // Using any to match mapped subject structure or raw DTO
    students: Student[];
}

interface Enrollment {
    enrollmentId: string;
    student: {
        studentId: number;
        user: {
            name: string;
            email: string;
        };
        registerNumber: string;
    };
    course: {
        courseId: number;
        courseName: string;
        courseCode: string;
    };
    semester: string;
}

export function EnrollmentManager({ courses, students }: EnrollmentManagerProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [showEnrollDialog, setShowEnrollDialog] = useState(false);

    const handleCourseChange = async (courseId: string) => {
        setSelectedCourseId(courseId);
        if (courseId) {
            fetchEnrollments(parseInt(courseId));
        } else {
            setEnrollments([]);
        }
    };

    const fetchEnrollments = async (courseId: number) => {
        try {
            setIsLoading(true);
            const data = await adminService.getCourseEnrollments(courseId);
            setEnrollments(data);
        } catch (error) {
            console.error("Failed to fetch enrollments", error);
            toast.error("Failed to fetch enrollments");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!selectedCourseId || !selectedStudentId) return;

        try {
            setIsEnrolling(true);
            await adminService.enrollStudent(parseInt(selectedStudentId), parseInt(selectedCourseId));
            toast.success("Student enrolled successfully");
            fetchEnrollments(parseInt(selectedCourseId));
            setSelectedStudentId(""); // Reset student selection
            setShowEnrollDialog(false); // Close dialog
        } catch (error: any) {
            console.error("Failed to enroll student", error);
            toast.error(error.response?.data || "Failed to enroll student");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleRemoveEnrollment = async (studentId: number) => {
        if (!confirm("Are you sure you want to remove this enrollment?")) return;

        try {
            await adminService.removeEnrollment(studentId, parseInt(selectedCourseId));
            toast.success("Enrollment removed");
            fetchEnrollments(parseInt(selectedCourseId));
        } catch (error) {
            console.error("Failed to remove enrollment", error);
            toast.error("Failed to remove enrollment");
        }
    };

    // Filter out students who are already enrolled
    const availableStudents = students.filter(student =>
        !enrollments.some(enrollment => enrollment.student.studentId.toString() === student.id)
    );

    return (
        <div className="space-y-6">
            <Card className="shadow-card rounded-xl border-none">
                <CardHeader>
                    <CardTitle>Enrollment Management</CardTitle>
                    <CardDescription>Select a course to manage student enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-w-md">
                        <label className="text-sm font-medium">Select Course</label>
                        <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Select a course..." />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.id.toString()}>
                                        {course.code} - {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {selectedCourseId && (
                <Card className="shadow-card rounded-xl border-none">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Enrolled Students</CardTitle>
                            <CardDescription>
                                {enrollments.length} students enrolled in this course
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowEnrollDialog(true)}
                            className="rounded-xl gradient-primary shadow-primary"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Student
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : enrollments.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No students enrolled yet</p>
                                <Button
                                    variant="link"
                                    onClick={() => setShowEnrollDialog(true)}
                                    className="mt-2"
                                >
                                    Add your first student
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-xl border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Register No</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {enrollments.map((enrollment) => {
                                            const studentName = enrollment.student?.user?.name || "Unknown";
                                            const studentEmail = enrollment.student?.user?.email || "No Email";
                                            return (
                                                <TableRow key={enrollment.enrollmentId}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                                    {studentName.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {studentName}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{enrollment.student.registerNumber}</TableCell>
                                                    <TableCell>{studentEmail}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleRemoveEnrollment(enrollment.student.studentId)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enroll Student</DialogTitle>
                        <DialogDescription>
                            Select a student to enroll in this course.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Student</label>
                            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a student..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {availableStudents.map((student) => (
                                        <SelectItem key={student.id} value={student.id.toString()}>
                                            {student.name} ({student.rollNo})
                                        </SelectItem>
                                    ))}
                                    {availableStudents.length === 0 && (
                                        <div className="p-2 text-sm text-center text-muted-foreground">
                                            {students.length === 0 ? "No students found in system" : "No more students available to enroll"}
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleEnroll}
                            disabled={!selectedStudentId || isEnrolling}
                            className="gradient-primary"
                        >
                            {isEnrolling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Enroll
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
