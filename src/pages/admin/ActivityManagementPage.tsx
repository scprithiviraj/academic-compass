import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import adminService, { Activity, ActivityStep, CreateActivityDTO } from "@/services/admin.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Target, ListTodo, MoreVertical, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function ActivityManagementPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog states
    const [showDialog, setShowDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    // Form states
    const [formData, setFormData] = useState<CreateActivityDTO>({
        title: "",
        type: "INDIVIDUAL",
        description: "",
        difficulty: "BEGINNER",

        category: "Coding",
        durationMinutes: 60,
        xp: 100,
        steps: [],
    });

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllActivities();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities", error);
            toast.error("Failed to load activities");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingActivity(null);
        setFormData({
            title: "",
            type: "INDIVIDUAL",
            description: "",
            difficulty: "BEGINNER",

            category: "Coding",
            durationMinutes: 60,
            xp: 100,
            steps: [],
        });
        setShowDialog(true);
    };

    const handleEdit = (activity: Activity) => {
        setEditingActivity(activity);
        setFormData({
            title: activity.title,
            type: activity.type,
            description: activity.description,
            difficulty: activity.difficulty,
            category: activity.category,
            durationMinutes: activity.durationMinutes,
            xp: activity.xp,
            steps: activity.steps ? [...activity.steps] : [],
        });
        setShowDialog(true);
    };

    const handleDelete = async (activityId: number) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;
        try {
            await adminService.deleteActivity(activityId);
            toast.success("Activity deleted successfully");
            fetchActivities();
        } catch (error: any) {
            console.error("Failed to delete activity", error);
            toast.error(error.response?.data || "Failed to delete activity");
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            if (!formData.title || !formData.description) {
                toast.error("Please fill in all required fields");
                return;
            }

            if (editingActivity) {
                await adminService.updateActivity(editingActivity.activityId, formData);
                toast.success("Activity updated successfully");
            } else {
                await adminService.createActivity(formData);
                toast.success("Activity created successfully");
            }
            setShowDialog(false);
            fetchActivities();
        } catch (error: any) {
            console.error("Failed to save activity", error);
            toast.error(error.response?.data || "Failed to save activity");
        } finally {
            setIsSaving(false);
        }
    };

    // Step Management
    const handleAddStep = () => {
        const newStep: ActivityStep = {
            title: "",
            description: "",
            stepNumber: (formData.steps?.length || 0) + 1
        };
        setFormData({ ...formData, steps: [...(formData.steps || []), newStep] });
    };

    const handleUpdateStep = (index: number, field: keyof ActivityStep, value: any) => {
        const updatedSteps = [...(formData.steps || [])];
        updatedSteps[index] = { ...updatedSteps[index], [field]: value };
        setFormData({ ...formData, steps: updatedSteps });
    };

    const handleRemoveStep = (index: number) => {
        const updatedSteps = (formData.steps || []).filter((_, i) => i !== index);
        // Re-number steps
        const renumbered = updatedSteps.map((step, i) => ({ ...step, stepNumber: i + 1 }));
        setFormData({ ...formData, steps: renumbered });
    };

    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    // Enrollment State
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [showEnrollDialog, setShowEnrollDialog] = useState(false);
    const [showEditEnrollDialog, setShowEditEnrollDialog] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [selectedActivityId, setSelectedActivityId] = useState<string>("");

    const fetchEnrollments = async () => {
        try {
            const data = await adminService.getAllActivityEnrollments();
            setEnrollments(data);
        } catch (error) {
            console.error("Failed to fetch enrollments", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await adminService.getAllStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const handleEnrollStudent = async () => {
        try {
            if (!selectedStudentId || !selectedActivityId) {
                toast.error("Please select both student and activity");
                return;
            }
            await adminService.enrollStudentInActivity(parseInt(selectedStudentId), parseInt(selectedActivityId));
            toast.success("Student enrolled successfully");
            setShowEnrollDialog(false);
            fetchEnrollments();
        } catch (error: any) {
            console.error("Failed to enroll student", error);
            toast.error(error.response?.data || "Failed to enroll student");
        }
    };

    const handleDeleteEnrollment = async (enrollmentId: number) => {
        if (!confirm("Are you sure you want to remove this enrollment?")) return;
        try {
            await adminService.deleteActivityEnrollment(enrollmentId);
            toast.success("Enrollment removed");
            fetchEnrollments();
        } catch (error) {
            console.error("Failed to remove enrollment", error);
            toast.error("Failed to remove enrollment");
        }
    };

    const handleUpdateEnrollment = async () => {
        if (!editingEnrollment) return;
        try {
            await adminService.updateActivityEnrollment(editingEnrollment.enrollmentId, {
                status: editingEnrollment.status,
                completedSteps: editingEnrollment.completedSteps
            });
            toast.success("Enrollment updated");
            setShowEditEnrollDialog(false);
            fetchEnrollments();
        } catch (error) {
            console.error("Failed to update enrollment", error);
            toast.error("Failed to update enrollment");
        }
    };

    // Initial fetch for enrollments tab dependencies
    useEffect(() => {
        fetchStudents();
        fetchEnrollments();
    }, []);

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "ALL" || activity.category === categoryFilter;
        // Since backend uses SKILL/CAREER but user asked for INDIVIDUAL/DUAL filters, we might need a mapping or assume data aligns.
        // For now, filtering exactly by usage. If 'INDIVIDUAL' is passed in data (like in sample), it will work.
        const matchesType = typeFilter === "ALL" || activity.type === typeFilter;

        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold tracking-tight">Activity Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Create and manage student activities and tasks
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="activities" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="activities">Activities</TabsTrigger>
                        <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                    </TabsList>

                    <TabsContent value="activities" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={handleCreate} className="rounded-xl gradient-primary shadow-primary">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Activity
                            </Button>
                        </div>
                        <Card className="border-none shadow-card">
                            <CardHeader className="flex flex-col space-y-4 pb-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                                <CardTitle className="text-xl font-semibold">Activities List</CardTitle>
                                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-[140px] rounded-xl">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Categories</SelectItem>
                                            <SelectItem value="Coding">Coding</SelectItem>
                                            <SelectItem value="Skills">Skills</SelectItem>
                                            <SelectItem value="Reading">Reading</SelectItem>
                                            <SelectItem value="Projects">Projects</SelectItem>
                                            <SelectItem value="Research">Research</SelectItem>
                                            <SelectItem value="Practice">Practice</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[140px] rounded-xl">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Types</SelectItem>
                                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                                            <SelectItem value="DUAL">Dual</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="relative w-64">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search activities..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center p-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : filteredActivities.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
                                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No activities found</p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Difficulty</TableHead>
                                                    <TableHead>Steps</TableHead>
                                                    <TableHead>XP</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredActivities.map((activity) => (
                                                    <TableRow key={activity.activityId}>
                                                        <TableCell className="font-medium">{activity.title}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{activity.category}</Badge>
                                                        </TableCell>
                                                        <TableCell>{activity.type}</TableCell>
                                                        <TableCell>
                                                            <span className={
                                                                activity.difficulty?.toUpperCase() === 'BEGINNER' ? 'text-green-600' :
                                                                    activity.difficulty?.toUpperCase() === 'INTERMEDIATE' ? 'text-yellow-600' :
                                                                        'text-red-600'
                                                            }>
                                                                {activity.difficulty}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>{activity.totalSteps}</TableCell>
                                                        <TableCell>{activity.xp} XP</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleEdit(activity)}
                                                                >
                                                                    <Pencil className="h-4 w-4 text-blue-500" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(activity.activityId)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="enrollments" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => setShowEnrollDialog(true)} className="rounded-xl gradient-primary shadow-primary">
                                <Plus className="mr-2 h-4 w-4" />
                                Enroll Student
                            </Button>
                        </div>
                        <Card className="border-none shadow-card">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">Student Enrollments</CardTitle>
                                <CardDescription>Manage student participation in activities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {enrollments.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
                                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No active enrollments found</p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Activity</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Progress</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {enrollments.map((enrollment) => (
                                                    <TableRow key={enrollment.enrollmentId}>
                                                        <TableCell className="font-medium">
                                                            {enrollment.student?.user?.name || enrollment.student?.name || "Unknown Student"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {enrollment.activity?.title || "Unknown Activity"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={enrollment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                                {enrollment.status || 'IN_PROGRESS'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {enrollment.completedSteps || 0} Steps
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        setEditingEnrollment({ ...enrollment });
                                                                        setShowEditEnrollDialog(true);
                                                                    }}
                                                                >
                                                                    <Pencil className="h-4 w-4 text-blue-500" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDeleteEnrollment(enrollment.enrollmentId)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Create/Edit Dialog */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingActivity ? "Edit Activity" : "Create New Activity"}</DialogTitle>
                            <DialogDescription>
                                Defines the details and steps for this activity.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label>Activity Title</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Build a Portfolio Website"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the activity..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Coding">Coding</SelectItem>
                                            <SelectItem value="Skills">Skills</SelectItem>
                                            <SelectItem value="Reading">Reading</SelectItem>
                                            <SelectItem value="Projects">Projects</SelectItem>
                                            <SelectItem value="Research">Research</SelectItem>
                                            <SelectItem value="Practice">Practice</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                                            <SelectItem value="DUAL">Dual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <Select
                                        value={formData.difficulty}
                                        onValueChange={(val) => setFormData({ ...formData, difficulty: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>XP Reward</Label>
                                    <Input
                                        type="number"
                                        value={formData.xp}
                                        onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration (Minutes)</Label>
                                    <Input
                                        type="number"
                                        value={formData.durationMinutes}
                                        onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-lg font-semibold">Activity Steps</Label>
                                    <Button variant="outline" size="sm" onClick={handleAddStep}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Step
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {formData.steps?.map((step, index) => (
                                        <div key={index} className="flex gap-4 items-start p-4 bg-muted/30 rounded-lg border">
                                            <div className="flex-none pt-2">
                                                <Badge variant="secondary" className="rounded-full h-6 w-6 flex items-center justify-center p-0">
                                                    {index + 1}
                                                </Badge>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    placeholder="Step Title"
                                                    value={step.title}
                                                    onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                                                    className="font-medium"
                                                />
                                                <Textarea
                                                    placeholder="Step Description"
                                                    value={step.description}
                                                    onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                                                    className="h-20 text-sm"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={() => handleRemoveStep(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {formData.steps?.length === 0 && (
                                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                            No steps added yet. Add steps to guide students.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="gradient-primary">
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {editingActivity ? "Update Activity" : "Create Activity"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Enroll Student Dialog */}
                <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enroll Student in Activity</DialogTitle>
                            <DialogDescription>
                                Select a student and an activity to create a new enrollment.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Student</Label>
                                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map(s => (
                                            <SelectItem key={s.studentId} value={s.studentId.toString()}>
                                                {s.user?.name || s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Activity</Label>
                                <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Activity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activities.map(a => (
                                            <SelectItem key={a.activityId} value={a.activityId.toString()}>
                                                {a.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>Cancel</Button>
                            <Button onClick={handleEnrollStudent} className="gradient-primary">Enroll</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Enrollment Dialog */}
                <Dialog open={showEditEnrollDialog} onOpenChange={setShowEditEnrollDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Enrollment</DialogTitle>
                            <DialogDescription>
                                Update enrollment status and progress.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={editingEnrollment?.status}
                                    onValueChange={(val) => setEditingEnrollment({ ...editingEnrollment, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Completed Steps</Label>
                                <Input
                                    type="number"
                                    value={editingEnrollment?.completedSteps}
                                    onChange={(e) => setEditingEnrollment({ ...editingEnrollment, completedSteps: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowEditEnrollDialog(false)}>Cancel</Button>
                            <Button onClick={handleUpdateEnrollment} className="gradient-primary">Update</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
