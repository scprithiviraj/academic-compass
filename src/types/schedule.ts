export type ClassStatus = "completed" | "ongoing" | "upcoming" | "free" | "cancelled";

export interface ScheduleClass {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  startTime: string;
  endTime: string;
  status: ClassStatus;
  color?: string;
  day: number; // 0-6 (Sunday-Saturday)
  attendanceStatus?: 'PRESENT' | 'ABSENT' | 'LATE' | null;
}

export interface DaySchedule {
  date: Date;
  classes: ScheduleClass[];
}
