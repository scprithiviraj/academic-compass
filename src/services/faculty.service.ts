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
    // New fields
    xp: number;
    activitiesCompleted: number;
    avgGrade: string;
    status: 'active' | 'at-risk' | 'critical';
    phone: string;
    department: string;
    semester: number;
    avatarUrl?: string;
}

export interface TodayClass {
    id: number;
    subject: string;
    code: string;
    section: string;
    time: string;
    room: string;
    students: number;
    status?: 'completed' | 'ongoing' | 'upcoming';
}

export interface QRCodeResponse {
    sessionId: number;
    qrToken: string;
    otpCode: string;
    expiresAt?: string;
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

export interface DashboardClass {
    id: number;
    subject: string;
    code: string;
    section: string;
    time: string;
    room: string;
    students: number;
    status: 'completed' | 'ongoing' | 'upcoming';
    attendance: number;
    isFreePeriod?: boolean;
}

export interface DashboardStats {
    totalStudents: number;
    todayAttendancePercentage: number;
    todayAttendanceCount: string;
    classesToday: number;
    classesCompleted: number;
    classesOngoing: number;
    lowAttendanceCount: number;
}

export interface WeeklyTrendData {
    day: string;
    attendance: number;
}

export interface LowAttendanceAlert {
    userId: number;
    name: string;
    rollNo: string;
    attendance: number;
    classes: string;
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

    generateQRCode: async (courseId: number, startTime?: string, endTime?: string) => {
        const response = await api.post<QRCodeResponse>('/api/attendance/generate-qr', {
            courseId,
            startTime,
            endTime
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

    getSessionAttendance: async (sessionId: number) => {
        const response = await api.get<any[]>(`/api/attendance/session/${sessionId}/records`);
        return response.data;
    },

    getDashboardData: async (userId: number | string) => {
        const response = await api.get<DashboardClass[]>(`/api/faculty/${userId}/dashboard-data`);
        return response.data;
    },

    getDashboardStats: async (userId: number | string) => {
        const response = await api.get<DashboardStats>(`/api/faculty/${userId}/dashboard-stats`);
        return response.data;
    },

    getWeeklyTrend: async (userId: number | string) => {
        const response = await api.get<WeeklyTrendData[]>(`/api/faculty/${userId}/weekly-trend`);
        return response.data;
    },

    getLowAttendanceAlerts: async (userId: number | string) => {
        const response = await api.get<LowAttendanceAlert[]>(`/api/faculty/${userId}/low-attendance-alerts`);
        return response.data;
    },

    endSession: async (sessionId: number) => {
        const response = await api.post(`/api/attendance/session/${sessionId}/end`, {});
        return response.data;
    },

    markFreePeriod: async (courseId: number, startTime: string, endTime: string) => {
        const response = await api.post('/api/attendance/session/free-period', {
            courseId,
            startTime,
            endTime
        });
        return response.data;
    }
};
