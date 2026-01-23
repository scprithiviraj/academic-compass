import { useState } from "react";
import { Subject, Faculty } from "@/data/curriculum";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react";

interface SubjectsTableProps {
  subjects: Subject[];
  faculty: Faculty[];
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
  onAssignFaculty: (subject: Subject) => void;
}

export function SubjectsTable({
  subjects,
  faculty,
  onEdit,
  onDelete,
  onAssignFaculty,
}: SubjectsTableProps) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const departments = [...new Set(subjects.map((s) => s.department))];

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(search.toLowerCase()) ||
      subject.code.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || subject.department === departmentFilter;
    const matchesType = typeFilter === "all" || subject.type === typeFilter;
    return matchesSearch && matchesDepartment && matchesType;
  });

  const getFacultyName = (facultyId?: string) => {
    if (!facultyId) return "Unassigned";
    const f = faculty.find((f) => f.id === facultyId);
    return f?.name || "Unknown";
  };

  const getTypeVariant = (type: Subject["type"]) => {
    switch (type) {
      case "core":
        return "default";
      case "elective":
        return "secondary";
      case "lab":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="core">Core</SelectItem>
              <SelectItem value="elective">Elective</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-mono font-medium">
                  {subject.code}
                </TableCell>
                <TableCell className="font-medium">{subject.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {subject.department}
                </TableCell>
                <TableCell>{subject.credits}</TableCell>
                <TableCell>Sem {subject.semester}</TableCell>
                <TableCell>
                  <Badge variant={getTypeVariant(subject.type)}>
                    {subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      subject.facultyId
                        ? "text-foreground"
                        : "text-muted-foreground italic"
                    }
                  >
                    {getFacultyName(subject.facultyId)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(subject)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Subject
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAssignFaculty(subject)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign Faculty
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(subject.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredSubjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No subjects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredSubjects.length} of {subjects.length} subjects
      </div>
    </div>
  );
}
