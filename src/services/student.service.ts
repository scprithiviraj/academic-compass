import api from './api';

export interface WeeklyScheduleItem {
    slotId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacherId: number;
    teacherName: string;
    roomNumber: string;
    courseId: number;
}

export interface Goal {
    goalId?: number;
    title: string;
    description: string;
    targetDate: string;
    status: 'IN_PROGRESS' | 'COMPLETED';
    goalType: 'SHORT' | 'LONG';
}

export const studentService = {
    getWeeklySchedule: async (studentId: number | string) => {
        const response = await api.get<WeeklyScheduleItem[]>(`/api/student/schedule/weekly/${studentId}`);
        return response.data;
    },

    getAttendanceStats: async (userId: number | string) => {
        // Updated to use the correct endpoint from AttendanceController if needed, 
        // or ensure StudentController proxies it. Assuming existing works or fixing if broken.
        // Actually, let's keep it as is if it works, but since I'm here...
        // The user didn't ask to fix stats here, but to add goals.
        const response = await api.get(`/api/student/dashboard/stats/${userId}`);
        return response.data;
    },

    getAttendanceHistory: async (userId: number | string) => {
        const response = await api.get(`/api/student/dashboard/recent/${userId}`);
        return response.data;
    },

    getAttendanceByRange: async (userId: number | string, startDate: string, endDate: string) => {
        const response = await api.get(`/api/attendance/student/${userId}/range?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    },

    getTodayClasses: async (userId: number | string) => {
        const response = await api.get(`/api/student/dashboard/today/${userId}`);
        return response.data;
    },

    // Goal Management
    getGoals: async (studentId: number | string) => {
        const response = await api.get<Goal[]>(`/api/student/goals/${studentId}`);
        return response.data;
    },

    addGoal: async (studentId: number | string, goal: Goal) => {
        const response = await api.post<Goal>(`/api/student/goals/${studentId}`, goal);
        return response.data;
    },

    updateGoal: async (goalId: number | string, goal: Goal) => {
        const response = await api.put<Goal>(`/api/student/goals/${goalId}`, goal);
        return response.data;
    },

    deleteGoal: async (goalId: number | string) => {
        await api.delete(`/api/student/goals/${goalId}`);
    }
};
