import api from './api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    department?: string;
    year?: number;
    section?: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    email: string;
    name: string;
    role: string;
    studentId?: number;
    teacherId?: number;
}

export interface User {
    userId: number;
    name: string;
    email: string;
    role: string;
    department?: string;
    year?: number;
    section?: string;
}

export interface StudentProfileUpdate {
    interests?: string;
    strengths?: string;
    careerGoals?: string;
}

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/api/auth/login', {
            email,
            password,
        });

        // Store token and user info
        if (response.data.token) {
            localStorage.setItem('jwt_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    }

    async register(userData: RegisterRequest): Promise<string> {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    }

    async getProfile(): Promise<User> {
        const response = await api.get<User>('/api/auth/profile');
        return response.data;
    }

    async updateStudentProfile(studentId: number, profileData: StudentProfileUpdate): Promise<User> {
        const response = await api.put<User>(`/api/auth/student/profile/${studentId}`, profileData);
        return response.data;
    }

    logout(): void {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
    }

    getCurrentUser(): LoginResponse | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    getToken(): string | null {
        return localStorage.getItem('jwt_token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export default new AuthService();
