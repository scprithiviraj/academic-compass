import api from './api';

export interface ActivityStep {
    stepId: number;
    stepNumber: number;
    title: string;
    description: string;
}

export interface Activity {
    activityId: number;
    title: string;
    description: string;
    type: string;
    difficulty: string;
    category: string;
    durationMinutes: number;
    xp: number;
    totalSteps: number;
    steps?: ActivityStep[];
    departmentId?: number;
    isActive: boolean;
}

export interface ActivityRecommendation {
    activity: Activity;
    matchScore: number;
    reason: string;
}

export interface ActivityEnrollment {
    enrollmentId: number;
    studentId: number;
    activityId: number;
    enrolledAt?: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    completedSteps?: number;
}

export interface TopActivityResponse {
    activityId: number;
    title: string;
    completedCount: number;
}

export interface StudentActivityProgressResponse {
    activityId: number;
    title: string;
    totalSteps: number;
    completedSteps: number;
    progressPercentage: number;
    status: string;
    completedStepNumbers?: number[];
}

export interface GamificationStats {
    totalXP: number;
    level: number;
    activitiesCompleted: number;
    currentStreak: number;
    totalTimeSpent: number;
    xpForNextLevel?: number;
    xpProgressPercentage?: number;
}


class ActivityService {
    async getRecommendedActivities(userId: number): Promise<ActivityRecommendation[]> {
        const response = await api.get<ActivityRecommendation[]>(
            `/api/activities/recommend/${userId}`
        );
        return response.data;
    }

    async getAllActivities(): Promise<Activity[]> {
        const response = await api.get<Activity[]>('/api/activities');
        return response.data;
    }

    async getActivityById(activityId: number): Promise<Activity> {
        const response = await api.get<Activity>(`/api/activities/${activityId}`);
        return response.data;
    }

    async enrollInActivity(studentId: number, activityId: number): Promise<ActivityEnrollment> {
        const response = await api.post<ActivityEnrollment>(`/api/activities/enroll?userId=${studentId}&activityId=${activityId}`);
        return response.data;
    }

    async getStudentEnrollments(studentId: number): Promise<ActivityEnrollment[]> {
        const response = await api.get<ActivityEnrollment[]>(
            `/api/activities/enrollments/${studentId}`
        );
        return response.data;
    }

    async dropActivity(enrollmentId: number): Promise<void> {
        await api.delete(`/api/activities/enrollments/${enrollmentId}`);
    }

    async createActivity(activityData: Partial<Activity>): Promise<Activity> {
        const response = await api.post<Activity>('/api/activities', activityData);
        return response.data;
    }

    async updateActivity(activityId: number, activityData: Partial<Activity>): Promise<Activity> {
        const response = await api.put<Activity>(`/api/activities/${activityId}`, activityData);
        return response.data;
    }

    async deleteActivity(activityId: number): Promise<void> {
        await api.delete(`/api/activities/${activityId}`);
    }

    async completeActivityStep(userId: number, activityId: number, stepNumber: number): Promise<StudentActivityProgressResponse> {
        const response = await api.post<StudentActivityProgressResponse>(
            `/api/activities/step/complete?userId=${userId}&activityId=${activityId}&stepNumber=${stepNumber}`
        );
        return response.data;
    }

    async getTopActivitiesByDepartment(departmentId: number): Promise<TopActivityResponse[]> {
        const response = await api.get<TopActivityResponse[]>(`/api/activities/top-by-department?departmentId=${departmentId}`);
        return response.data;
    }

    async getStudentActivityProgress(userId: number): Promise<StudentActivityProgressResponse[]> {
        const response = await api.get<StudentActivityProgressResponse[]>(`/api/activities/progress/${userId}`);
        return response.data;
    }

    async getGamificationStats(userId: number): Promise<GamificationStats> {
        const response = await api.get<GamificationStats>(`/api/student/dashboard/gamification/${userId}`);
        return response.data;
    }
}

export default new ActivityService();
