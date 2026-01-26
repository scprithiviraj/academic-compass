import { useState, useEffect } from "react";
import { ClassSlot, Subject, Faculty, Department, days, timeSlots } from "@/data/curriculum";
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

interface AddSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: Subject[];
  faculty: Faculty[];
  departments: Department[];
  onAdd: (slot: Omit<ClassSlot, "id">) => void;
  editSlot?: ClassSlot | null;
  defaultDay?: string;
  defaultTime?: string;
}

export function AddSlotDialog({
  open,
  onOpenChange,
  subjects,
  faculty,
  departments,
  onAdd,
  editSlot,
  defaultDay,
  defaultTime,
}: AddSlotDialogProps) {
  const [formData, setFormData] = useState<Omit<ClassSlot, "id">>({
    subjectId: editSlot?.subjectId || "",
    facultyId: editSlot?.facultyId || "",
    day: (editSlot?.day || defaultDay || "Monday") as ClassSlot["day"],
    date: editSlot?.date || undefined,
    startTime: editSlot?.startTime || defaultTime || "09:00",
    endTime: editSlot?.endTime || "10:00",
    room: editSlot?.room || "",
    section: editSlot?.section || "A",
    department: editSlot?.department || "",
    semester: editSlot?.semester || 1,
  });

  useEffect(() => {
    if (defaultDay) {
      setFormData((prev) => ({ ...prev, day: defaultDay as ClassSlot["day"] }));
    }
    if (defaultTime) {
      const startIdx = timeSlots.indexOf(defaultTime);
      const endTime = startIdx >= 0 && startIdx < timeSlots.length - 1
        ? timeSlots[startIdx + 1]
        : "10:00";
      setFormData((prev) => ({ ...prev, startTime: defaultTime, endTime }));
    }
  }, [defaultDay, defaultTime]);

  const handleSubjectChange = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      setFormData({
        ...formData,
        subjectId,
        facultyId: subject.facultyId || formData.facultyId,
        semester: subject.semester,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subjectId || !formData.facultyId || !formData.room || !formData.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAdd(formData);
    onOpenChange(false);
    toast.success(editSlot ? "Class slot updated" : "Class slot added");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editSlot ? "Edit Class Slot" : "Add Class Slot"}
          </DialogTitle>
          <DialogDescription>
            {editSlot
              ? "Update the class schedule details"
              : "Schedule a new class in the timetable"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select value={formData.subjectId} onValueChange={handleSubjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty *</Label>
            <Select
              value={formData.facultyId}
              onValueChange={(v) => setFormData({ ...formData, facultyId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {faculty.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name} ({f.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date (Optional)</Label>
              <Input
                type="date"
                id="date"
                value={formData.date || ""}
                onChange={(e) => {
                  const dateVal = e.target.value;
                  let dayOfWeek = formData.day;
                  if (dateVal) {
                    const dateObj = new Date(dateVal);
                    // Get day name from date (e.g. "Monday")
                    const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const dayIdx = dateObj.getDay();
                    const mappedDay = daysArr[dayIdx];
                    if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(mappedDay)) {
                      dayOfWeek = mappedDay as any;
                    }
                  }
                  setFormData({ ...formData, date: dateVal, day: dayOfWeek });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="day">Day *</Label>
              <Select
                value={formData.day}
                onValueChange={(v) =>
                  setFormData({ ...formData, day: v as ClassSlot["day"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room *</Label>
              <Input
                id="room"
                placeholder="e.g., Room 301"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Select
                value={formData.startTime}
                onValueChange={(v) => {
                  const startIdx = timeSlots.indexOf(v);
                  const endTime =
                    startIdx >= 0 && startIdx < timeSlots.length - 1
                      ? timeSlots[startIdx + 1]
                      : formData.endTime;
                  setFormData({ ...formData, startTime: v, endTime });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.slice(0, -1).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Select
                value={formData.endTime}
                onValueChange={(v) =>
                  setFormData({ ...formData, endTime: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.slice(1).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
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
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(v) =>
                  setFormData({ ...formData, department: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Dept" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.code}>
                      {d.code}
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
              {editSlot ? "Update Slot" : "Add Slot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
