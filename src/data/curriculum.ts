export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: number;
  type: "core" | "elective" | "lab";
  facultyId?: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  subjects: string[];
  avatar?: string;
}

export interface ClassSlot {
  id: string;
  subjectId: string;
  facultyId: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  room: string;
  section: string;
  department: string;
  semester: number;
  date?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  totalStudents: number;
  totalFaculty: number;
}

// Mock Data
export const departmentsData: Department[] = [
  { id: "d1", name: "Computer Science", code: "CS", head: "Dr. Sarah Johnson", totalStudents: 450, totalFaculty: 28 },
  { id: "d2", name: "Electronics", code: "ECE", head: "Prof. Michael Chen", totalStudents: 380, totalFaculty: 24 },
  { id: "d3", name: "Mechanical", code: "ME", head: "Dr. Robert Wilson", totalStudents: 320, totalFaculty: 20 },
  { id: "d4", name: "Civil", code: "CE", head: "Prof. Emily Davis", totalStudents: 280, totalFaculty: 18 },
  { id: "d5", name: "Business Administration", code: "MBA", head: "Dr. James Brown", totalStudents: 200, totalFaculty: 15 },
];

export const facultyData: Faculty[] = [
  { id: "f1", name: "Dr. Sarah Johnson", email: "sarah.j@university.edu", department: "Computer Science", designation: "Professor", subjects: ["CS301", "CS401"] },
  { id: "f2", name: "Prof. Michael Chen", email: "m.chen@university.edu", department: "Computer Science", designation: "Associate Professor", subjects: ["CS201", "CS302"] },
  { id: "f3", name: "Dr. Emily Davis", email: "e.davis@university.edu", department: "Computer Science", designation: "Assistant Professor", subjects: ["CS101", "CS202"] },
  { id: "f4", name: "Prof. Robert Wilson", email: "r.wilson@university.edu", department: "Electronics", designation: "Professor", subjects: ["ECE301", "ECE401"] },
  { id: "f5", name: "Dr. Lisa Anderson", email: "l.anderson@university.edu", department: "Electronics", designation: "Associate Professor", subjects: ["ECE201", "ECE302"] },
  { id: "f6", name: "Prof. David Martinez", email: "d.martinez@university.edu", department: "Mechanical", designation: "Professor", subjects: ["ME301", "ME401"] },
  { id: "f7", name: "Dr. Jennifer Taylor", email: "j.taylor@university.edu", department: "Business Administration", designation: "Associate Professor", subjects: ["MBA501", "MBA502"] },
  { id: "f8", name: "Prof. William Brown", email: "w.brown@university.edu", department: "Civil", designation: "Professor", subjects: ["CE301", "CE401"] },
];

export const subjectsData: Subject[] = [
  { id: "s1", code: "CS101", name: "Introduction to Programming", department: "Computer Science", credits: 4, semester: 1, type: "core", facultyId: "f3" },
  { id: "s2", code: "CS201", name: "Data Structures", department: "Computer Science", credits: 4, semester: 3, type: "core", facultyId: "f2" },
  { id: "s3", code: "CS202", name: "Object Oriented Programming", department: "Computer Science", credits: 3, semester: 3, type: "core", facultyId: "f3" },
  { id: "s4", code: "CS301", name: "Database Management Systems", department: "Computer Science", credits: 4, semester: 5, type: "core", facultyId: "f1" },
  { id: "s5", code: "CS302", name: "Operating Systems", department: "Computer Science", credits: 4, semester: 5, type: "core", facultyId: "f2" },
  { id: "s6", code: "CS401", name: "Machine Learning", department: "Computer Science", credits: 3, semester: 7, type: "elective", facultyId: "f1" },
  { id: "s7", code: "CS-LAB1", name: "Programming Lab", department: "Computer Science", credits: 2, semester: 1, type: "lab", facultyId: "f3" },
  { id: "s8", code: "ECE201", name: "Digital Electronics", department: "Electronics", credits: 4, semester: 3, type: "core", facultyId: "f5" },
  { id: "s9", code: "ECE301", name: "Microprocessors", department: "Electronics", credits: 4, semester: 5, type: "core", facultyId: "f4" },
  { id: "s10", code: "ECE302", name: "Communication Systems", department: "Electronics", credits: 3, semester: 5, type: "core", facultyId: "f5" },
  { id: "s11", code: "ME301", name: "Thermodynamics", department: "Mechanical", credits: 4, semester: 5, type: "core", facultyId: "f6" },
  { id: "s12", code: "CE301", name: "Structural Analysis", department: "Civil", credits: 4, semester: 5, type: "core", facultyId: "f8" },
  { id: "s13", code: "MBA501", name: "Business Strategy", department: "Business Administration", credits: 3, semester: 1, type: "core", facultyId: "f7" },
];

export const timetableData: ClassSlot[] = [
  { id: "t1", subjectId: "s1", facultyId: "f3", day: "Monday", startTime: "09:00", endTime: "10:00", room: "Room 101", section: "A", department: "CSE", semester: 1 },
  { id: "t2", subjectId: "s2", facultyId: "f2", day: "Monday", startTime: "10:00", endTime: "11:00", room: "Room 201", section: "A", department: "CSE", semester: 3 },
  { id: "t3", subjectId: "s3", facultyId: "f3", day: "Monday", startTime: "11:00", endTime: "12:00", room: "Room 202", section: "A", department: "CSE", semester: 3 },
  { id: "t4", subjectId: "s4", facultyId: "f1", day: "Monday", startTime: "14:00", endTime: "15:00", room: "Room 301", section: "A", department: "CSE", semester: 5 },
  { id: "t5", subjectId: "s5", facultyId: "f2", day: "Tuesday", startTime: "09:00", endTime: "10:00", room: "Room 301", section: "A", department: "CSE", semester: 5 },
  { id: "t6", subjectId: "s6", facultyId: "f1", day: "Tuesday", startTime: "10:00", endTime: "11:00", room: "Lab 3", section: "A", department: "CSE", semester: 7 },
  { id: "t7", subjectId: "s7", facultyId: "f3", day: "Tuesday", startTime: "14:00", endTime: "16:00", room: "Lab 1", section: "A", department: "CSE", semester: 1 },
  { id: "t8", subjectId: "s8", facultyId: "f5", day: "Wednesday", startTime: "09:00", endTime: "10:00", room: "Room 102", section: "A", department: "ECE", semester: 3 },
  { id: "t9", subjectId: "s9", facultyId: "f4", day: "Wednesday", startTime: "10:00", endTime: "11:00", room: "Room 103", section: "A", department: "ECE", semester: 5 },
  { id: "t10", subjectId: "s1", facultyId: "f3", day: "Wednesday", startTime: "11:00", endTime: "12:00", room: "Room 101", section: "B", department: "CSE", semester: 1 },
  { id: "t11", subjectId: "s10", facultyId: "f5", day: "Thursday", startTime: "09:00", endTime: "10:00", room: "Room 104", section: "A", department: "ECE", semester: 5 },
  { id: "t12", subjectId: "s11", facultyId: "f6", day: "Thursday", startTime: "10:00", endTime: "11:00", room: "Room 105", section: "A", department: "MECH", semester: 5 },
  { id: "t13", subjectId: "s12", facultyId: "f8", day: "Thursday", startTime: "14:00", endTime: "15:00", room: "Room 106", section: "A", department: "CIVIL", semester: 5 },
  { id: "t14", subjectId: "s13", facultyId: "f7", day: "Friday", startTime: "09:00", endTime: "10:00", room: "Room 401", section: "A", department: "MBA", semester: 1 },
  { id: "t15", subjectId: "s2", facultyId: "f2", day: "Friday", startTime: "10:00", endTime: "11:00", room: "Room 201", section: "B", department: "CSE", semester: 3 },
];

export const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  section: string;
  semester: number;
  year?: number;
  email: string;
}

export const studentsData: Student[] = [
  { id: "st1", name: "John Doe", rollNo: "CS2023001", department: "Computer Science", section: "A", semester: 3, email: "john.doe@university.edu" },
  { id: "st2", name: "Jane Smith", rollNo: "CS2023002", department: "Computer Science", section: "B", semester: 3, email: "jane.smith@university.edu" },
  { id: "st3", name: "Alice Johnson", rollNo: "CS2023003", department: "Computer Science", section: "A", semester: 5, email: "alice.j@university.edu" },
  { id: "st4", name: "Bob Wilson", rollNo: "ECE2023001", department: "Electronics", section: "A", semester: 3, email: "bob.w@university.edu" },
  { id: "st5", name: "Charlie Brown", rollNo: "ME2023001", department: "Mechanical", section: "A", semester: 5, email: "charlie.b@university.edu" },
  { id: "st6", name: "Diana Prince", rollNo: "CS2023004", department: "Computer Science", section: "A", semester: 1, email: "diana.p@university.edu" },
];
