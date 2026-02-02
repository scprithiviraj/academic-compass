import { useState } from "react";
import { Faculty, Subject, Department } from "@/data/curriculum";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Mail, BookOpen, Edit, Eye, Loader2, Save } from "lucide-react";
import adminService from "@/services/admin.service";
import { toast } from "sonner";

interface FacultyListProps {
  faculty: Faculty[];
  subjects: Subject[];
  departments: Department[];
  onEdit: (faculty: Faculty) => void;
  onViewDetails: (faculty: Faculty) => void;
  onRefresh?: () => void;
}

export function FacultyList({ faculty, subjects, departments, onEdit, onViewDetails, onRefresh }: FacultyListProps) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Dialog States
  const [viewFaculty, setViewFaculty] = useState<Faculty | null>(null);
  const [editFaculty, setEditFaculty] = useState<Faculty | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());

    let matchesDepartment = departmentFilter === "all";
    if (departmentFilter !== "all") {
      // Find the selected department object to compare both name and code
      // We iterate departments to find the one matching the filter (which provides the code)
      // Wait, the SelectItem value relies on dept.code.
      // So departmentFilter IS the code.
      const selectedDept = departments.find(d => d.code === departmentFilter);
      if (selectedDept) {
        matchesDepartment = f.department === selectedDept.code || f.department === selectedDept.name;
      } else {
        // Fallback if we can't find the department object (unlikely), just compare equality
        matchesDepartment = f.department === departmentFilter;
      }
    }

    return matchesSearch && matchesDepartment;
  });

  const getSubjectNames = (subjectCodes: string[]) => {
    return subjectCodes
      .map((code) => {
        const subject = subjects.find((s) => s.code === code);
        return subject?.name || code;
      })
      .slice(0, 2);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    if (!editFaculty) return;

    try {
      setIsSaving(true);
      // Ensure we passed the correct ID format to backend. Assuming backend expects simple object update.
      // We are updating user details primarily (Name, Email) and Staff details (Designation, Department).
      await adminService.updateFaculty(parseInt(editFaculty.id), {
        name: editFaculty.name,
        email: editFaculty.email,
        department: editFaculty.department,
        designation: editFaculty.designation
      });

      toast.success("Faculty updated successfully");
      setEditFaculty(null);
      if (onRefresh) {
        onRefresh();
      } else {
        // Fallback: If parent didn't pass refresh, we might need to manually reload or warn.
        // Ideally parent should pass onRefresh. For now, just toast.
        window.location.reload(); // Force reload if no handler provided (simple fix for now)
      }
    } catch (error: any) {
      console.error("Failed to update faculty", error);
      toast.error(error.response?.data?.message || "Failed to update faculty");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.code}>
                {dept.name} ({dept.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Faculty Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFaculty.map((f) => (
          <Card key={f.id} className="shadow-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarImage src={f.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(f.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{f.name}</h4>
                  <p className="text-sm text-muted-foreground">{f.designation}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {f.department}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{f.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {getSubjectNames(f.subjects).map((name, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {name.length > 20 ? name.slice(0, 20) + "..." : name}
                      </Badge>
                    ))}
                    {f.subjects.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{f.subjects.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setViewFaculty(f)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditFaculty(f)}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No faculty members found
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Showing {filteredFaculty.length} of {faculty.length} faculty members
      </div>

      {/* View Faculty Dialog */}
      <Dialog open={!!viewFaculty} onOpenChange={(open) => !open && setViewFaculty(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Faculty Details</DialogTitle>
          </DialogHeader>
          {viewFaculty && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={viewFaculty.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {getInitials(viewFaculty.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{viewFaculty.name}</h3>
                  <p className="text-muted-foreground">{viewFaculty.designation}</p>
                  <Badge className="mt-1">{viewFaculty.department}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{viewFaculty.email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Subjects</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewFaculty.subjects.length > 0 ? (
                      viewFaculty.subjects.map((code) => {
                        const subject = subjects.find(s => s.code === code);
                        return (
                          <Badge key={code} variant="secondary">
                            {subject ? `${subject.name} (${code})` : code}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground italic">No subjects assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewFaculty(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Faculty Dialog */}
      <Dialog open={!!editFaculty} onOpenChange={(open) => !open && setEditFaculty(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Faculty</DialogTitle>
            <DialogDescription>Update faculty member details.</DialogDescription>
          </DialogHeader>
          {editFaculty && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editFaculty.name}
                  onChange={(e) => setEditFaculty({ ...editFaculty, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editFaculty.email}
                  onChange={(e) => setEditFaculty({ ...editFaculty, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={editFaculty.department}
                    onValueChange={(val) => setEditFaculty({ ...editFaculty, department: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.code}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Select
                    value={editFaculty.designation}
                    onValueChange={(val) => setEditFaculty({ ...editFaculty, designation: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Head of Department">Head of Department</SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject assignment is complex to implement inline without a proper multi-select, leaving as View-Only for now or handled via Courses page */}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFaculty(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="gradient-primary">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
