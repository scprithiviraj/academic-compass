import { useState } from "react";
import { Faculty, Subject } from "@/data/curriculum";
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
import { Search, Mail, BookOpen, Edit, Eye } from "lucide-react";

interface FacultyListProps {
  faculty: Faculty[];
  subjects: Subject[];
  onEdit: (faculty: Faculty) => void;
  onViewDetails: (faculty: Faculty) => void;
}

export function FacultyList({ faculty, subjects, onEdit, onViewDetails }: FacultyListProps) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const departments = [...new Set(faculty.map((f) => f.department))];

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || f.department === departmentFilter;
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
              <SelectItem key={dept} value={dept}>
                {dept}
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
                  onClick={() => onViewDetails(f)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(f)}
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
    </div>
  );
}
