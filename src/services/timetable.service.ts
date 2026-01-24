import api from './api';

export interface TimetableSlot {
    slotId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacherId: number;
    teacherName: string;
    roomNumber: string;
    classId: number;
}

export interface Timetable {
    timetableId: number;
    studentId?: number;
    teacherId?: number;
    department: string;
    year: number;
    section: string;
    slots: TimetableSlot[];
}

export interface FreePeriod {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    duration: number;
}

class TimetableService {
    async getStudentTimetable(studentId: number): Promise<Timetable> {
        const response = await api.get<Timetable>(`/api/timetable/student/${studentId}`);
        return response.data;
    }

    async getTeacherTimetable(teacherId: number): Promise<Timetable> {
        const response = await api.get<Timetable>(`/api/timetable/teacher/${teacherId}`);
        return response.data;
    }

    async getTimetableByClass(
        department: string,
        year: number,
        section: string
    ): Promise<Timetable> {
        const response = await api.get<Timetable>('/api/timetable/class', {
            params: { department, year, section },
        });
        return response.data;
    }

    async getFreePeriods(studentId: number): Promise<FreePeriod[]> {
        const response = await api.get<FreePeriod[]>(`/api/timetable/free-periods/${studentId}`);
        return response.data;
    }

    async createTimetableSlot(slotData: Partial<TimetableSlot>): Promise<TimetableSlot> {
        const response = await api.post<TimetableSlot>('/api/timetable/slot', slotData);
        return response.data;
    }

    async updateTimetableSlot(
        slotId: number,
        slotData: Partial<TimetableSlot>
    ): Promise<TimetableSlot> {
        const response = await api.put<TimetableSlot>(`/api/timetable/slot/${slotId}`, slotData);
        return response.data;
    }

    async deleteTimetableSlot(slotId: number): Promise<void> {
        await api.delete(`/api/timetable/slot/${slotId}`);
    }

    async getTodaySchedule(userId: number, userType: 'student' | 'teacher'): Promise<TimetableSlot[]> {
        const endpoint =
            userType === 'student'
                ? `/api/timetable/student/${userId}/today`
                : `/api/timetable/teacher/${userId}/today`;
        const response = await api.get<TimetableSlot[]>(endpoint);
        return response.data;
    }
}

export default new TimetableService();
