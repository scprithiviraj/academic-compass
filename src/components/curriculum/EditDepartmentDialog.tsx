
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Department, Faculty } from "@/data/curriculum";

interface EditDepartmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    department: Department | null;
    faculty: Faculty[];
    onSave: (id: number | null, data: any) => Promise<void>;
}

export function EditDepartmentDialog({
    open,
    onOpenChange,
    department,
    faculty,
    onSave,
}: EditDepartmentDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        headId: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name,
                code: department.code,
                description: department.description || "",
                headId: (department as any).headId?.toString() || "",
            });
        } else {
            setFormData({
                name: "",
                code: "",
                description: "",
                headId: "",
            });
        }
    }, [department, open]);

    const handleSubmit = async () => {
        try {
            setIsSaving(true);
            const headIdPayload = (formData.headId && formData.headId !== "none") ? parseInt(formData.headId) : null;

            await onSave(department ? parseInt(department.id) : null, {
                name: formData.name,
                code: formData.code,
                description: formData.description,
                headId: headIdPayload,
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Filter faculty to suggest those in the department, but allow all
    const deptFaculty = faculty.filter(f => f.department === formData.code || f.department === formData.name);
    const otherFaculty = faculty.filter(f => f.department !== formData.code && f.department !== formData.name);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{department ? "Edit Department" : "Add Department"}</DialogTitle>
                    <DialogDescription>
                        {department ? "Update department details and assign Head of Department." : "Create a new department and optionally assign a Head."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">
                            Code
                        </Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hod" className="text-right">
                            HOD
                        </Label>
                        <Select
                            value={formData.headId}
                            onValueChange={(value) => setFormData({ ...formData, headId: value })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select HOD" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {deptFaculty.length > 0 && (
                                    <>
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Department Faculty</div>
                                        {deptFaculty.map((f) => (
                                            <SelectItem key={f.id} value={f.id}>
                                                {f.name}
                                            </SelectItem>
                                        ))}
                                    </>
                                )}
                                {otherFaculty.length > 0 && (
                                    <>
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Other Faculty</div>
                                        {otherFaculty.map((f) => (
                                            <SelectItem key={f.id} value={f.id}>
                                                {f.name}
                                            </SelectItem>
                                        ))}
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="desc"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
