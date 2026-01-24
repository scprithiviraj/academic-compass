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
}

export default new AdminService();
