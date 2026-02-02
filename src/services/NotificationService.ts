import api from './api';

export interface AppNotification {
    id: number;
    title: string;
    message: string;
    type: 'announcement' | 'alert' | 'reminder' | 'info' | 'success' | 'warning' | 'achievement';
    category: string;
    audience?: 'all' | 'students' | 'faculty' | 'admins';
    status?: 'sent' | 'scheduled' | 'draft';
    sentAt?: string;
    read: boolean;
    readCount?: number;
}

export interface CreateNotificationDTO {
    title: string;
    message: string;
    type: string;
    audience: string;
    sendNow: boolean;
}

const notificationService = {
    // Admin Methods
    createNotification: async (data: CreateNotificationDTO) => {
        const response = await api.post('/api/notifications', data);
        return response.data;
    },

    getAllNotifications: async () => {
        const response = await api.get<AppNotification[]>('/api/notifications/admin/all');
        return response.data;
    },

    deleteNotification: async (id: number) => {
        await api.delete(`/api/notifications/${id}`);
    },

    // User Methods
    getUserNotifications: async () => {
        const response = await api.get<AppNotification[]>('/api/notifications/my');
        return response.data;
    },

    markAsRead: async (id: number) => {
        await api.put(`/api/notifications/${id}/read`);
    },

    markAllAsRead: async () => {
        await api.put('/api/notifications/read-all');
    }
};

export default notificationService;
