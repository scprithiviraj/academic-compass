import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SubjectsTable } from "@/components/curriculum/SubjectsTable";
import { FacultyList } from "@/components/curriculum/FacultyList";
import { TimetableGrid } from "@/components/curriculum/TimetableGrid";
import { DepartmentCards } from "@/components/curriculum/DepartmentCards";
import { AddSubjectDialog } from "@/components/curriculum/AddSubjectDialog";
import { AddSlotDialog } from "@/components/curriculum/AddSlotDialog";
import {
  subjectsData,
  facultyData,
  timetableData,
  departmentsData,
  Subject,
  ClassSlot,
  Faculty,
  Department,
} from "@/data/curriculum";
import { Plus, BookOpen, Users, Calendar, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function CurriculumPage() {
  const [activeTab, setActiveTab] = useState("subjects");
  const [subjects, setSubjects] = useState(subjectsData);
  const [slots, setSlots] = useState(timetableData);

  // Dialog states
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [editSlot, setEditSlot] = useState<ClassSlot | null>(null);
  const [defaultSlotDay, setDefaultSlotDay] = useState<string>("");
  const [defaultSlotTime, setDefaultSlotTime] = useState<string>("");

  // Subject handlers
  const handleAddSubject = (newSubject: Omit<Subject, "id">) => {
    const subject: Subject = {
      ...newSubject,
      id: `s${subjects.length + 1}`,
    };
    setSubjects([...subjects, subject]);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditSubject(subject);
    setShowAddSubject(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter((s) => s.id !== subjectId));
    toast.success("Subject deleted");
  };

  const handleAssignFaculty = (subject: Subject) => {
    setEditSubject(subject);
    setShowAddSubject(true);
  };

  // Slot handlers
  const handleAddSlot = (day: string, time: string) => {
    setDefaultSlotDay(day);
    setDefaultSlotTime(time);
    setEditSlot(null);
    setShowAddSlot(true);
  };

  const handleEditSlot = (slot: ClassSlot) => {
    setEditSlot(slot);
    setShowAddSlot(true);
  };

  const handleSaveSlot = (newSlot: Omit<ClassSlot, "id">) => {
    if (editSlot) {
      setSlots(
        slots.map((s) => (s.id === editSlot.id ? { ...newSlot, id: s.id } : s))
      );
    } else {
      const slot: ClassSlot = {
        ...newSlot,
        id: `t${slots.length + 1}`,
      };
      setSlots([...slots, slot]);
    }
  };

  // Faculty handlers
  const handleEditFaculty = (faculty: Faculty) => {
    toast.info(`Edit ${faculty.name} - Coming soon`);
  };

  const handleViewFaculty = (faculty: Faculty) => {
    toast.info(`View ${faculty.name} - Coming soon`);
  };

  // Department handlers
  const handleManageDepartment = (department: Department) => {
    toast.info(`Manage ${department.name} - Coming soon`);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Curriculum Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage subjects, faculty assignments, and class schedules
            </p>
          </div>
          <div className="flex gap-3 animate-fade-in stagger-1" style={{ opacity: 0 }}>
            {activeTab === "subjects" && (
              <Button
                onClick={() => {
                  setEditSubject(null);
                  setShowAddSubject(true);
                }}
                className="rounded-xl gradient-primary shadow-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            )}
            {activeTab === "timetable" && (
              <Button
                onClick={() => {
                  setEditSlot(null);
                  setDefaultSlotDay("");
                  setDefaultSlotTime("");
                  setShowAddSlot(true);
                }}
                className="rounded-xl gradient-primary shadow-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="subjects"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger
              value="faculty"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
            >
              <Users className="h-4 w-4" />
              Faculty
            </TabsTrigger>
            <TabsTrigger
              value="timetable"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
            >
              <Calendar className="h-4 w-4" />
              Timetable
            </TabsTrigger>
            <TabsTrigger
              value="departments"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
            >
              <Building2 className="h-4 w-4" />
              Departments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="animate-fade-in">
            <SubjectsTable
              subjects={subjects}
              faculty={facultyData}
              onEdit={handleEditSubject}
              onDelete={handleDeleteSubject}
              onAssignFaculty={handleAssignFaculty}
            />
          </TabsContent>

          <TabsContent value="faculty" className="animate-fade-in">
            <FacultyList
              faculty={facultyData}
              subjects={subjects}
              onEdit={handleEditFaculty}
              onViewDetails={handleViewFaculty}
            />
          </TabsContent>

          <TabsContent value="timetable" className="animate-fade-in">
            <TimetableGrid
              slots={slots}
              subjects={subjects}
              faculty={facultyData}
              onAddSlot={handleAddSlot}
              onEditSlot={handleEditSlot}
            />
          </TabsContent>

          <TabsContent value="departments" className="animate-fade-in">
            <DepartmentCards
              departments={departmentsData}
              onManage={handleManageDepartment}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddSubjectDialog
        open={showAddSubject}
        onOpenChange={(open) => {
          setShowAddSubject(open);
          if (!open) setEditSubject(null);
        }}
        faculty={facultyData}
        onAdd={handleAddSubject}
        editSubject={editSubject}
      />

      <AddSlotDialog
        open={showAddSlot}
        onOpenChange={(open) => {
          setShowAddSlot(open);
          if (!open) {
            setEditSlot(null);
            setDefaultSlotDay("");
            setDefaultSlotTime("");
          }
        }}
        subjects={subjects}
        faculty={facultyData}
        onAdd={handleSaveSlot}
        editSlot={editSlot}
        defaultDay={defaultSlotDay}
        defaultTime={defaultSlotTime}
      />
    </DashboardLayout>
  );
}
