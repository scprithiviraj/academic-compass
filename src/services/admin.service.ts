import api from './api';

export interface Course {
    courseId: number;
    courseCode: string;
    courseName: string;
    department: string;
    credit: number;
    semester: number;
    type: string;
    staff?: {
        staffId: number;
        user: {
            name: string;
        };
    };
}

export interface CourseDTO {
    courseCode: string;
    courseName: string;
    department: string;
    credit: number;
    semester: number;
    type: string;
    staffId?: number;
}

export interface DepartmentDTO {
    id: number;
    name: string;
    code: string;
    head: string;
    totalStudents: number;
    totalFaculty: number;
    description: string;
}

export interface StaffDTO {
    id: number;
    name: string;
    email: string;
    department: string;
    designation: string;
    avatar?: string;
    subjects: string[];
}

class AdminService {
    async getAllCourses(): Promise<Course[]> {
        const response = await api.get<Course[]>('/api/admin/courses');
        return response.data;
    }

    async addCourse(course: CourseDTO): Promise<Course> {
        const response = await api.post<Course>('/api/admin/course', course);
        return response.data;
    }

    async updateCourse(courseId: number, course: CourseDTO): Promise<Course> {
        const response = await api.put<Course>(`/api/admin/course/${courseId}`, course);
        return response.data;
    }

    async deleteCourse(courseId: number): Promise<void> {
        await api.delete(`/api/admin/course/${courseId}`);
    }

    async getAllStudents(): Promise<any[]> {
        const response = await api.get('/api/admin/students');
        return response.data;
    }

    async getSystemStats(): Promise<any> {
        const response = await api.get('/api/admin/system/stats');
        return response.data;
    }

    async getAllDepartments(): Promise<DepartmentDTO[]> {
        const response = await api.get<DepartmentDTO[]>('/api/admin/departments');
        return response.data;
    }

    async getAllFaculty(): Promise<StaffDTO[]> {
        const response = await api.get<StaffDTO[]>('/api/admin/faculty');
        return response.data;
    }

    async getTimetable(): Promise<any[]> {
        const response = await api.get<any[]>('/api/admin/timetable');
        return response.data;
    }

    async addTimetableSlot(slot: any): Promise<any> {
        const response = await api.post('/api/admin/timetable', slot);
        return response.data;
    }

    async updateTimetableSlot(id: string, slot: any): Promise<any> {
        const response = await api.put(`/api/admin/timetable/${id}`, slot);
        return response.data;
    }

    async getAllUsers(): Promise<any[]> {
        const response = await api.get<any[]>('/api/admin/users');
        return response.data;
    }

    async updateStudent(studentId: string, data: any): Promise<any> {
        const response = await api.put(`/api/admin/student/${studentId}`, data);
        return response.data;
    }

    async addUser(user: any): Promise<any> {
        const response = await api.post('/api/admin/user', user);
        return response.data;
    }

    async updateUser(userId: string, user: any): Promise<any> {
        const response = await api.put(`/api/admin/user/${userId}`, user);
        return response.data;
    }

    async deleteUser(userId: string): Promise<void> {
        await api.delete(`/api/admin/user/${userId}`);
    }

    async getDailyAttendanceStats(date: Date): Promise<any> {
        // Format date as YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];
        const response = await api.get(`/api/admin/attendance/daily-stats?date=${formattedDate}`);
        return response.data;
    }

    async getLowAttendanceStudents(): Promise<any[]> {
        const response = await api.get<any[]>('/api/admin/attendance/low-attendance');
        return response.data;
    }

    async exportAttendanceToCSV(startDate?: Date, endDate?: Date): Promise<Blob> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
        if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);

        const response = await api.get('/api/admin/reports/export/csv', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }

    async exportAttendanceToExcel(startDate?: Date, endDate?: Date): Promise<Blob> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
        if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);

        const response = await api.get('/api/admin/reports/export/excel', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }

    async exportStudentsToCSV(department?: string, semester?: string): Promise<Blob> {
        const params = new URLSearchParams();
        if (department && department !== 'all') params.append('department', department);
        if (semester && semester !== 'all') params.append('semester', semester);

        const response = await api.get('/api/admin/reports/export/students/csv', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }

    async exportStudentsToExcel(department?: string, semester?: string): Promise<Blob> {
        const params = new URLSearchParams();
        if (department && department !== 'all') params.append('department', department);
        if (semester && semester !== 'all') params.append('semester', semester);

        const response = await api.get('/api/admin/reports/export/students/excel', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }

    async exportCoursesToCSV(department?: string, semester?: string): Promise<Blob> {
        const params = new URLSearchParams();
        if (department && department !== 'all') params.append('department', department);
        if (semester && semester !== 'all') params.append('semester', semester);

        const response = await api.get('/api/admin/reports/export/courses/csv', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }

    async exportCoursesToExcel(department?: string, semester?: string): Promise<Blob> {
        const params = new URLSearchParams();
        if (department && department !== 'all') params.append('department', department);
        if (semester && semester !== 'all') params.append('semester', semester);

        const response = await api.get('/api/admin/reports/export/courses/excel', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }

    async exportDepartmentsToCSV(): Promise<Blob> {
        const response = await api.get('/api/admin/reports/export/departments/csv', {
            responseType: 'blob'
        });
        return response.data;
    }

    async exportDepartmentsToExcel(): Promise<Blob> {
        const response = await api.get('/api/admin/reports/export/departments/excel', {
            responseType: 'blob'
        });
        return response.data;
    }

    async getDashboardStats(): Promise<any> {
        const response = await api.get('/api/admin/dashboard/stats');
        return response.data;
    }
}

export default new AdminService();
