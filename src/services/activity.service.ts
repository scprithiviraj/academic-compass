import api from './api';

export interface Activity {
    activityId: number;
    title: string;
    description: string;
    type: string;
    level: string;
    category: string;
    duration: number;
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
    enrolledAt: string;
    status: 'ENROLLED' | 'COMPLETED' | 'DROPPED';
}

class ActivityService {
    async getRecommendedActivities(studentId: number): Promise<ActivityRecommendation[]> {
        const response = await api.get<ActivityRecommendation[]>(
            `/api/activities/recommendations/${studentId}`
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
        const response = await api.post<ActivityEnrollment>('/api/activities/enroll', {
            studentId,
            activityId,
        });
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
}

export default new ActivityService();
