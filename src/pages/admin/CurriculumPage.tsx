import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import adminService, { CourseDTO } from "@/services/admin.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SubjectsTable } from "@/components/curriculum/SubjectsTable";
import { FacultyList } from "@/components/curriculum/FacultyList";
import { TimetableGrid } from "@/components/curriculum/TimetableGrid";
import { StudentList } from "@/components/curriculum/StudentList";
import { EditStudentDialog } from "@/components/curriculum/EditStudentDialog";
import { DepartmentCards } from "@/components/curriculum/DepartmentCards";
import { EditDepartmentDialog } from "@/components/curriculum/EditDepartmentDialog";
import { AddSubjectDialog } from "@/components/curriculum/AddSubjectDialog";
import { AddSlotDialog } from "@/components/curriculum/AddSlotDialog";
import { EnrollmentManager } from "@/components/curriculum/EnrollmentManager";
import {
  subjectsData,
  facultyData,
  departmentsData,
  Subject,
  ClassSlot,
  Faculty,
  Department,
  Student,
} from "@/data/curriculum";
import { Plus, BookOpen, Users, Calendar, Building2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function CurriculumPage() {
  const [activeTab, setActiveTab] = useState("subjects");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>(departmentsData);

  const [faculty, setFaculty] = useState<Faculty[]>(facultyData);
  const [slots, setSlots] = useState<ClassSlot[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchFaculty();
    fetchTimetable();
    fetchStudents();
  }, []);

  const fetchTimetable = async () => {
    try {
      const data = await adminService.getTimetable();
      setSlots(data);
    } catch (error) {
      console.error("Failed to fetch timetable", error);
      toast.error("Failed to load timetable");
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await adminService.getAllStudents();
      // Assumption: Backend returns data that mostly matches our Student interface.
      // We might need to map it if the structure differs significantly.
      // Creating a safe mapper based on expected API response structure
      const mappedStudents: Student[] = data.map((s: any) => ({
        id: s.studentId?.toString() || s.id?.toString() || Math.random().toString(),
        name: s.name || s.user?.name || "Unknown",
        rollNo: s.rollNo || s.registerNumber || "N/A",
        department: s.department || "General",
        section: s.section || "A",
        semester: s.semester || 1,
        year: s.year || 1,
        email: s.email || s.user?.email || "N/A"
      }));
      setStudentsList(mappedStudents);
    } catch (error) {
      console.error("Failed to fetch students", error);
      toast.error("Failed to load students");
    }
  };

  const fetchFaculty = async () => {
    try {
      const staffDTOs = await adminService.getAllFaculty();
      const mappedFaculty: Faculty[] = staffDTOs.map(f => ({
        id: f.id.toString(),
        name: f.name,
        email: f.email,
        department: f.department,
        designation: f.designation,
        subjects: f.subjects || [],
        avatar: f.avatar
      }));
      setFaculty(mappedFaculty);
    } catch (error) {
      console.error("Failed to fetch faculty", error);
      toast.error("Failed to load faculty");
    }
  }

  const fetchDepartments = async () => {
    try {
      const deptDTOs = await adminService.getAllDepartments();
      const mappedDepts: Department[] = deptDTOs.map(d => ({
        id: d.id.toString(),
        name: d.name,
        code: d.code,
        head: d.head,
        headId: d.headId?.toString(),
        totalStudents: d.totalStudents,
        totalFaculty: d.totalFaculty,
        description: d.description
      }));
      setDepartments(mappedDepts);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      toast.error("Failed to load departments");
    }
  }

  const fetchCourses = async () => {
    try {
      const courses = await adminService.getAllCourses();
      const mappedSubjects: Subject[] = courses.map(c => ({
        id: c.courseId.toString(),
        code: c.courseCode,
        name: c.courseName,
        department: c.department || "General",
        credits: c.credit,
        semester: c.semester || 1,
        type: (c.type?.toLowerCase() as "core" | "elective" | "lab") || "core",
        facultyId: c.staff?.user?.name ? c.staff.staffId.toString() : undefined // Mapping staffId if available
      }));
      setSubjects(mappedSubjects);
    } catch (error) {
      console.error("Failed to fetch courses", error);
      toast.error("Failed to load subjects");
    }
  };

  // Dialog states
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [editSlot, setEditSlot] = useState<ClassSlot | null>(null);
  const [defaultSlotDay, setDefaultSlotDay] = useState<string>("");
  const [defaultSlotTime, setDefaultSlotTime] = useState<string>("");

  const [showEditStudent, setShowEditStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);

  // Subject handlers
  // Subject handlers
  const handleAddSubject = async (newSubject: Omit<Subject, "id">) => {
    try {
      const courseDTO: CourseDTO = {
        courseCode: newSubject.code,
        courseName: newSubject.name,
        department: newSubject.department,
        credit: newSubject.credits,
        semester: newSubject.semester,
        type: newSubject.type.toUpperCase(),
        staffId: newSubject.facultyId ? parseInt(newSubject.facultyId) : undefined
      };

      if (editSubject) {
        // Update existing
        await adminService.updateCourse(parseInt(editSubject.id), courseDTO);
        toast.success("Subject updated successfully");
      } else {
        // Add new
        await adminService.addCourse(courseDTO);
        toast.success("Subject added successfully");
      }

      fetchCourses(); // Refresh list
      setShowAddSubject(false);
      setEditSubject(null);
    } catch (error) {
      console.error("Error saving subject:", error);
      toast.error("Failed to save subject");
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditSubject(subject);
    setShowAddSubject(true);
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await adminService.deleteCourse(parseInt(subjectId));
      setSubjects(subjects.filter((s) => s.id !== subjectId));
      toast.success("Subject deleted");
    } catch (error) {
      console.error("Failed to delete subject", error);
      toast.error("Failed to delete subject");
    }
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

  const handleSaveSlot = async (newSlot: Omit<ClassSlot, "id">) => {
    try {
      if (editSlot) {
        await adminService.updateTimetableSlot(editSlot.id, newSlot);
        toast.success("Class updated successfully");
      } else {
        await adminService.addTimetableSlot(newSlot);
        toast.success("Class added successfully");
      }
      fetchTimetable();
      setShowAddSlot(false);
      setEditSlot(null);
    } catch (error) {
      console.error("Failed to save slot", error);
      toast.error("Failed to save class slot");
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
    setEditDepartment(department);
    setShowEditDepartment(true);
  };

  const handleSaveDepartment = async (id: number | null, data: any) => {
    try {
      if (id) {
        await adminService.updateDepartment(id, data);
        toast.success("Department updated successfully");
      } else {
        await adminService.addDepartment(data);
        toast.success("Department added successfully");
      }
      fetchDepartments(); // Refresh list to see new Head
      // Also refresh faculty if needed
    } catch (error) {
      console.error("Failed to save department", error);
      toast.error("Failed to save department");
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      await adminService.deleteDepartment(parseInt(departmentId));
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      console.error("Failed to delete department", error);
      toast.error("Failed to delete department");
    }
  };

  // Student handlers
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowEditStudent(true);
  };

  const handleSaveStudent = async (updatedData: any) => {
    try {
      if (selectedStudent) {
        // Update existing
        await adminService.updateStudent(selectedStudent.id, {
          registerNumber: updatedData.rollNo,
          department: updatedData.department,
          section: updatedData.section,
          year: updatedData.year,
          name: updatedData.name,
          email: updatedData.email
        });
        toast.success("Student updated successfully");
      } else {
        // Add new
        await adminService.addUser({
          name: updatedData.name,
          email: updatedData.email,
          password: updatedData.password || "password123", // Default if missing
          role: "student",
          registerNumber: updatedData.rollNo,
          department: updatedData.department,
          section: updatedData.section,
          year: updatedData.year,
          phone: "0000000000"
        });
        toast.success("Student added successfully");
      }
      setShowEditStudent(false);
      fetchStudents(); // Refresh list
    } catch (error: any) {
      console.error("Failed to save student", error);
      toast.error(error.response?.data?.message || "Failed to save student");
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudentsList(studentsList.filter(s => s.id !== studentId));
    toast.success("Student removed successfully");
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
            {activeTab === "students" && (
              <Button
                onClick={() => {
                  setSelectedStudent(null);
                  setShowEditStudent(true);
                }}
                className="rounded-xl gradient-primary shadow-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Student
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
            {activeTab === "departments" && (
              <Button
                onClick={() => {
                  setEditDepartment(null);
                  setShowEditDepartment(true);
                }}
                className="rounded-xl gradient-primary shadow-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Department
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
              value="students"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger
              value="enrollment"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
            >
              <Users className="h-4 w-4" />
              Enrollment
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
              faculty={faculty}
              onEdit={handleEditSubject}
              onDelete={handleDeleteSubject}
              onAssignFaculty={handleAssignFaculty}
            />
          </TabsContent>

          <TabsContent value="faculty" className="animate-fade-in">
            <FacultyList
              faculty={faculty}
              subjects={subjects}
              departments={departments}
              onEdit={handleEditFaculty}
              onViewDetails={handleViewFaculty}
              onRefresh={fetchFaculty}
            />
          </TabsContent>

          <TabsContent value="timetable" className="animate-fade-in">
            <TimetableGrid
              slots={slots}
              subjects={subjects}
              faculty={facultyData}
              departments={departments}
              onAddSlot={handleAddSlot}
              onEditSlot={handleEditSlot}
            />
          </TabsContent>

          <TabsContent value="departments" className="animate-fade-in">
            <DepartmentCards
              departments={departments}
              onManage={handleManageDepartment}
              onDelete={handleDeleteDepartment}
            />
          </TabsContent>

          <TabsContent value="students" className="animate-fade-in">
            <StudentList
              students={studentsList}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          </TabsContent>

          <TabsContent value="enrollment" className="animate-fade-in">
            <EnrollmentManager courses={subjects} students={studentsList} />
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
        faculty={faculty}
        departments={departments}
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
        faculty={faculty}
        departments={departments}
        onAdd={handleSaveSlot}
        editSlot={editSlot}
        defaultDay={defaultSlotDay}
        defaultTime={defaultSlotTime}
      />

      <EditStudentDialog
        open={showEditStudent}
        onOpenChange={setShowEditStudent}
        student={selectedStudent}
        onSave={handleSaveStudent}
        departments={departments}
      />

      <EditDepartmentDialog
        open={showEditDepartment}
        onOpenChange={setShowEditDepartment}
        department={editDepartment}
        faculty={faculty}
        onSave={handleSaveDepartment}
      />
    </DashboardLayout >
  );
}


