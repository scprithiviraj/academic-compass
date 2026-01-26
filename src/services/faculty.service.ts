import api from './api';

export interface ClassSchedule {
    day: string;
    time: string;
    room: string;
}

export interface FacultyClass {
    id: number;
    subject: string;
    code: string;
    section: string;
    semester: number;
    schedule: ClassSchedule[];
    students: number;
    avgAttendance: number;
}

export interface StudentData {
    id: number;
    name: string;
    rollNo: string;
    email: string;
    attendance: number;
    classesAttended: number;
    totalClasses: number;
    lastAttended: string;
}

export interface TodayClass {
    id: number;
    subject: string;
    code: string;
    section: string;
    time: string;
    room: string;
    students: number;
}

export interface QRCodeResponse {
    sessionId: number;
    qrToken: string;
    otpCode: string;
    courseName: string;
    courseId: number;
}

export interface CourseStudent {
    studentId: number;
    userId: number;
    name: string;
    email: string;
    rollNo: string;
}

export const facultyService = {
    getFacultyClasses: async (userId: number | string) => {
        const response = await api.get<FacultyClass[]>(`/api/faculty/${userId}/classes`);
        return response.data;
    },

    getFacultyStudents: async (userId: number | string) => {
        const response = await api.get<StudentData[]>(`/api/faculty/${userId}/students`);
        return response.data;
    },

    getTodayClasses: async (userId: number | string) => {
        const response = await api.get<TodayClass[]>(`/api/faculty/${userId}/today-classes`);
        return response.data;
    },

    generateQRCode: async (courseId: number) => {
        const response = await api.post<QRCodeResponse>('/api/attendance/generate-qr', {
            courseId
        });
        return response.data;
    },

    getCourseStudents: async (courseId: number) => {
        const response = await api.get<CourseStudent[]>(`/api/attendance/course/${courseId}/students`);
        return response.data;
    },

    markAttendanceManual: async (sessionId: number, userId: number, status: string) => {
        const response = await api.post('/api/attendance/mark-manual', {
            sessionId,
            userId,
            status
        });
        return response.data;
    },
};
