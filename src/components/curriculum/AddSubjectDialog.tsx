import { useState, useEffect } from "react";
import { Subject, Faculty, Department } from "@/data/curriculum";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty[];
  departments: Department[];
  onAdd: (subject: Omit<Subject, "id">) => void;
  editSubject?: Subject | null;
}

export function AddSubjectDialog({
  open,
  onOpenChange,
  faculty,
  departments,
  onAdd,
  editSubject,
}: AddSubjectDialogProps) {
  const [formData, setFormData] = useState<Omit<Subject, "id">>({
    code: editSubject?.code || "",
    name: editSubject?.name || "",
    department: editSubject?.department || "",
    credits: editSubject?.credits || 3,
    semester: editSubject?.semester || 1,
    type: editSubject?.type || "core",
    facultyId: editSubject?.facultyId || undefined,
  });

  useEffect(() => {
    if (editSubject) {
      setFormData({
        code: editSubject.code,
        name: editSubject.name,
        department: editSubject.department,
        credits: editSubject.credits,
        semester: editSubject.semester,
        type: editSubject.type,
        facultyId: editSubject.facultyId,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        department: "",
        credits: 3,
        semester: 1,
        type: "core",
        facultyId: undefined,
      });
    }
  }, [editSubject, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name || !formData.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAdd(formData);
    onOpenChange(false);
    toast.success(editSubject ? "Subject updated successfully" : "Subject added successfully");

    // Reset form
    setFormData({
      code: "",
      name: "",
      department: "",
      credits: 3,
      semester: 1,
      type: "core",
      facultyId: undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editSubject ? "Edit Subject" : "Add New Subject"}
          </DialogTitle>
          <DialogDescription>
            {editSubject
              ? "Update the subject details below"
              : "Fill in the details to create a new subject"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Subject Code *</Label>
              <Input
                id="code"
                placeholder="e.g., CS301"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Select
                value={formData.credits.toString()}
                onValueChange={(v) =>
                  setFormData({ ...formData, credits: parseInt(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((c) => (
                    <SelectItem key={c} value={c.toString()}>
                      {c} Credit{c > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Database Management Systems"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(v) =>
                  setFormData({ ...formData, department: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={formData.semester.toString()}
                onValueChange={(v) =>
                  setFormData({ ...formData, semester: parseInt(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <SelectItem key={s} value={s.toString()}>
                      Semester {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Subject Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(v) =>
                  setFormData({ ...formData, type: v as Subject["type"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Assign Faculty</Label>
              <Select
                value={formData.facultyId || "unassigned"}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    facultyId: v === "unassigned" ? undefined : v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {faculty.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editSubject ? "Update Subject" : "Add Subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
