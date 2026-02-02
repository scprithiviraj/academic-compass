import api from './api';

export interface MentorProfile {
    mentorId: number;
    staffId: number;
    name: string;
    department: string;
    active: boolean;
    maxStudents: number;
    currentStudentCount: number;
}

export interface MentorStudentSummary {
    studentId: number;
    name: string;
    rollNo: string;
    email: string;
    phone: string;
    department: string;
    attendancePercentage: number;
    avgGrade: string;
    activitiesCompleted: number;
    xp: number;
    status: 'active' | 'at-risk' | 'critical';
    avatarUrl?: string;
}

export interface DailyAttendance {
    date: string;
    status: string;
    subject: string;
}

export interface SubjectAttendance {
    subject: string;
    percentage: number;
    totalClasses: number;
    presentClasses: number;
}

export interface StudentAttendanceAnalytics {
    overallPercentage: number;
    subjectWiseAttendance: SubjectAttendance[];
    history: DailyAttendance[];
}

export interface ClassSchedule {
    subject: string;
    startTime: string;
    endTime: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
    attendanceStatus: 'PRESENT' | 'ABSENT' | 'NOT_MARKED';
}

export interface MentorStudentAnalyticsDetail {
    studentId: number;
    name: string;
    rollNo: string;
    department: string;
    section: string;
    avatarUrl?: string;
    completedActivities: number;
    ongoingActivities: number;
    totalEnrolledActivities: number;
    activityCompletionPercentage: number;
    todayClasses: ClassSchedule[];
}

class MentorService {
    async registerAsMentor(id: number, maxStudents: number, type: 'staff' | 'user' = 'staff'): Promise<MentorProfile> {
        const payload = type === 'staff' ? { staffId: id, maxStudents } : { userId: id, maxStudents };
        const response = await api.post<MentorProfile>('/api/mentors/register', payload);
        return response.data;
    }

    async getMentorProfile(userId: number): Promise<MentorProfile> {
        const response = await api.get<MentorProfile>(`/api/mentors/profile/${userId}`);
        return response.data;
    }

    async getAssignedStudents(mentorId: number): Promise<MentorStudentSummary[]> {
        const response = await api.get<MentorStudentSummary[]>(`/api/mentors/${mentorId}/students`);
        return response.data;
    }

    async assignStudent(mentorId: number, studentId: number): Promise<void> {
        await api.post('/api/mentors/assign', { mentorId, studentId });
    }

    async getStudentAnalytics(studentId: number): Promise<StudentAttendanceAnalytics> {
        const response = await api.get<StudentAttendanceAnalytics>(`/api/mentors/student/${studentId}/analytics`);
        return response.data;
    }
    async getMentorStudentAnalyticsDetail(mentorId: number): Promise<MentorStudentAnalyticsDetail[]> {
        const response = await api.get<MentorStudentAnalyticsDetail[]>(`/api/mentors/${mentorId}/analytics/detail`);
        return response.data;
    }
}

export default new MentorService();
