import api from './api';

const settingsService = {
    getSettings: async () => {
        const response = await api.get<Record<string, string>>('/api/settings');
        return response.data;
    },

    updateSettings: async (settings: Record<string, string>) => {
        await api.post('/api/settings', settings);
    },
};

export default settingsService;
