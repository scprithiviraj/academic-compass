import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/data/curriculum";

interface EditStudentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    student: Student | null;
    onSave: (updatedStudent: Partial<Student>) => void;
    departments: { id: string; name: string; code: string }[];
}

export function EditStudentDialog({
    open,
    onOpenChange,
    student,
    onSave,
    departments,
}: EditStudentDialogProps) {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (open) {
            if (student) {
                setFormData({
                    name: student.name,
                    email: student.email,
                    rollNo: student.rollNo,
                    department: student.department,
                    section: student.section,
                    year: student.year || (student.semester ? Math.ceil(student.semester / 2) : 1),
                });
            } else {
                setFormData({
                    department: departments[0]?.code || "CS",
                    section: "A",
                    year: 1
                });
            }
        }
    }, [student, open, departments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{student ? "Edit Student" : "Add Student"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    {!student && (
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password || ""}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="rollNo">Register Number</Label>
                        <Input
                            id="rollNo"
                            value={formData.rollNo || ""}
                            onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(val) => setFormData({ ...formData, department: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select dept" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((d) => (
                                        <SelectItem key={d.code} value={d.code}>
                                            {d.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="section">Section</Label>
                            <Select
                                value={formData.section}
                                onValueChange={(val) => setFormData({ ...formData, section: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["A", "B", "C", "D"].map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                            id="year"
                            type="number"
                            min="1"
                            max="4"
                            value={formData.year || ""}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">{student ? "Save Changes" : "Add Student"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
