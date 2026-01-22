import { ScheduleClass } from "@/types/schedule";

// Weekly schedule template (repeating)
export const weeklySchedule: ScheduleClass[] = [
  // Monday (1)
  { id: "mon-1", subject: "Data Structures", faculty: "Dr. Johnson", room: "Lab 3", startTime: "09:00", endTime: "10:30", status: "upcoming", color: "bg-primary", day: 1 },
  { id: "mon-2", subject: "Machine Learning", faculty: "Prof. Chen", room: "Room 201", startTime: "11:00", endTime: "12:30", status: "upcoming", color: "bg-secondary", day: 1 },
  { id: "mon-3", subject: "Free Period", faculty: "-", room: "-", startTime: "12:30", endTime: "14:00", status: "free", color: "bg-accent", day: 1 },
  { id: "mon-4", subject: "Web Development", faculty: "Dr. Davis", room: "Lab 1", startTime: "14:00", endTime: "15:30", status: "upcoming", color: "bg-info", day: 1 },
  { id: "mon-5", subject: "Database Systems", faculty: "Prof. Smith", room: "Room 105", startTime: "16:00", endTime: "17:30", status: "upcoming", color: "bg-success", day: 1 },

  // Tuesday (2)
  { id: "tue-1", subject: "Computer Networks", faculty: "Dr. Wilson", room: "Room 302", startTime: "09:00", endTime: "10:30", status: "upcoming", color: "bg-warning", day: 2 },
  { id: "tue-2", subject: "Free Period", faculty: "-", room: "-", startTime: "11:00", endTime: "12:30", status: "free", color: "bg-accent", day: 2 },
  { id: "tue-3", subject: "Software Engineering", faculty: "Prof. Brown", room: "Room 201", startTime: "14:00", endTime: "15:30", status: "upcoming", color: "bg-destructive", day: 2 },
  { id: "tue-4", subject: "Operating Systems", faculty: "Dr. Taylor", room: "Lab 2", startTime: "16:00", endTime: "17:30", status: "upcoming", color: "bg-primary", day: 2 },

  // Wednesday (3)
  { id: "wed-1", subject: "Data Structures", faculty: "Dr. Johnson", room: "Lab 3", startTime: "09:00", endTime: "10:30", status: "upcoming", color: "bg-primary", day: 3 },
  { id: "wed-2", subject: "Machine Learning", faculty: "Prof. Chen", room: "Room 201", startTime: "11:00", endTime: "12:30", status: "upcoming", color: "bg-secondary", day: 3 },
  { id: "wed-3", subject: "Free Period", faculty: "-", room: "-", startTime: "14:00", endTime: "15:30", status: "free", color: "bg-accent", day: 3 },
  { id: "wed-4", subject: "Web Development", faculty: "Dr. Davis", room: "Lab 1", startTime: "16:00", endTime: "17:30", status: "upcoming", color: "bg-info", day: 3 },

  // Thursday (4)
  { id: "thu-1", subject: "Computer Networks", faculty: "Dr. Wilson", room: "Room 302", startTime: "09:00", endTime: "10:30", status: "upcoming", color: "bg-warning", day: 4 },
  { id: "thu-2", subject: "Database Systems", faculty: "Prof. Smith", room: "Room 105", startTime: "11:00", endTime: "12:30", status: "upcoming", color: "bg-success", day: 4 },
  { id: "thu-3", subject: "Free Period", faculty: "-", room: "-", startTime: "14:00", endTime: "15:30", status: "free", color: "bg-accent", day: 4 },
  { id: "thu-4", subject: "Software Engineering", faculty: "Prof. Brown", room: "Room 201", startTime: "16:00", endTime: "17:30", status: "upcoming", color: "bg-destructive", day: 4 },

  // Friday (5)
  { id: "fri-1", subject: "Operating Systems", faculty: "Dr. Taylor", room: "Lab 2", startTime: "09:00", endTime: "10:30", status: "upcoming", color: "bg-primary", day: 5 },
  { id: "fri-2", subject: "Machine Learning Lab", faculty: "Prof. Chen", room: "ML Lab", startTime: "11:00", endTime: "13:00", status: "upcoming", color: "bg-secondary", day: 5 },
  { id: "fri-3", subject: "Free Period", faculty: "-", room: "-", startTime: "14:00", endTime: "17:30", status: "free", color: "bg-accent", day: 5 },
];

export const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
