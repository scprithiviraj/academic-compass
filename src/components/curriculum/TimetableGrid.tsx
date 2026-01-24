import { useState } from "react";
import { ClassSlot, Subject, Faculty, Department, days, timeSlots } from "@/data/curriculum";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimetableGridProps {
  slots: ClassSlot[];
  subjects: Subject[];
  faculty: Faculty[];
  departments: Department[];
  onAddSlot: (day: string, time: string) => void;
  onEditSlot: (slot: ClassSlot) => void;
}

export function TimetableGrid({
  slots,
  subjects,
  faculty,
  departments,
  onAddSlot,
  onEditSlot,
}: TimetableGridProps) {
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const semesters = [...new Set(slots.map((s) => s.semester))].sort();

  const filteredSlots = slots.filter((slot) => {
    const matchesSemester =
      semesterFilter === "all" || slot.semester === parseInt(semesterFilter);
    const matchesDepartment = departmentFilter === "all" || slot.department === departmentFilter;
    return matchesSemester && matchesDepartment;
  });

  const getSlotForCell = (day: string, time: string) => {
    return filteredSlots.find(
      (slot) => slot.day === day && slot.startTime === time
    );
  };

  const getSubjectInfo = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId);
  };

  const getFacultyInfo = (facultyId: string) => {
    return faculty.find((f) => f.id === facultyId);
  };

  const getSlotColor = (subjectId: string) => {
    const subject = getSubjectInfo(subjectId);
    switch (subject?.type) {
      case "core":
        return "bg-primary/10 border-primary/30 hover:bg-primary/20";
      case "elective":
        return "bg-secondary/30 border-secondary/50 hover:bg-secondary/40";
      case "lab":
        return "bg-info/10 border-info/30 hover:bg-info/20";
      default:
        return "bg-muted border-border hover:bg-muted/80";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={semesterFilter} onValueChange={setSemesterFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {semesters.map((sem) => (
              <SelectItem key={sem} value={sem.toString()}>
                Semester {sem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[150px]">
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
        <div className="flex-1" />
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary/30" />
            <span className="text-muted-foreground">Core</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-secondary/50" />
            <span className="text-muted-foreground">Elective</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-info/30" />
            <span className="text-muted-foreground">Lab</span>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <Card className="shadow-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-left text-sm font-medium text-muted-foreground w-24">
                  Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="p-3 text-center text-sm font-medium text-foreground"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.slice(0, -1).map((time, idx) => (
                <tr key={time} className="border-b border-border last:border-0">
                  <td className="p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {time} - {timeSlots[idx + 1]}
                  </td>
                  {days.map((day) => {
                    const slot = getSlotForCell(day, time);
                    const subject = slot ? getSubjectInfo(slot.subjectId) : null;
                    const facultyMember = slot ? getFacultyInfo(slot.facultyId) : null;

                    return (
                      <td key={`${day}-${time}`} className="p-2">
                        {slot ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onEditSlot(slot)}
                                className={cn(
                                  "w-full p-3 rounded-lg border text-left transition-all",
                                  getSlotColor(slot.subjectId)
                                )}
                              >
                                <p className="font-medium text-sm truncate">
                                  {subject?.code}
                                </p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {subject?.name}
                                </p>
                                <div className="flex items-center gap-1 mt-1.5">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {slot.room}
                                  </span>
                                </div>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <div className="space-y-1">
                                <p className="font-semibold">{subject?.name}</p>
                                <div className="flex items-center gap-1 text-sm">
                                  <User className="h-3 w-3" />
                                  {facultyMember?.name}
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <MapPin className="h-3 w-3" />
                                  {slot.room}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  Section {slot.section} • Sem {slot.semester}
                                </Badge>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <button
                            onClick={() => onAddSlot(day, time)}
                            className="w-full h-20 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center justify-center group"
                          >
                            <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">
        {filteredSlots.length} classes scheduled
        {semesterFilter !== "all" && ` for Semester ${semesterFilter}`}
        {departmentFilter !== "all" && ` Department ${departmentFilter}`}
      </div>
    </div>
  );
}
