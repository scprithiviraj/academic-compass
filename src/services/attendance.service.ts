import api from './api';

export interface AttendanceRecord {
    attendanceId: number;
    studentId: number;
    classId: number;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    markedAt: string;
}

export interface MarkAttendanceRequest {
    classId: number;
    studentId: number;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface QRCodeData {
    qrCode: string;
    classId: number;
    expiresAt: string;
}

export interface AttendanceStats {
    totalClasses: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
}

class AttendanceService {
    async markAttendance(data: MarkAttendanceRequest): Promise<AttendanceRecord> {
        const response = await api.post<AttendanceRecord>('/api/attendance/mark', data);
        return response.data;
    }

    async getStudentAttendance(studentId: number): Promise<AttendanceRecord[]> {
        const response = await api.get<AttendanceRecord[]>(`/api/attendance/student/${studentId}`);
        return response.data;
    }

    async getClassAttendance(classId: number): Promise<AttendanceRecord[]> {
        const response = await api.get<AttendanceRecord[]>(`/api/attendance/class/${classId}`);
        return response.data;
    }

    async generateQRCode(classId: number): Promise<QRCodeData> {
        const response = await api.post<QRCodeData>('/api/attendance/qr/generate', { classId });
        return response.data;
    }

    async markAttendanceByQR(qrCode: string, studentId: number): Promise<AttendanceRecord> {
        const response = await api.post<AttendanceRecord>('/api/attendance/qr/mark', {
            qrCode,
            studentId,
        });
        return response.data;
    }

    async getAttendanceStats(studentId: number): Promise<AttendanceStats> {
        const response = await api.get<AttendanceStats>(`/api/attendance/stats/${studentId}`);
        return response.data;
    }

    async getAttendanceByDateRange(
        studentId: number,
        startDate: string,
        endDate: string
    ): Promise<AttendanceRecord[]> {
        const response = await api.get<AttendanceRecord[]>(
            `/api/attendance/student/${studentId}/range`,
            {
                params: { startDate, endDate },
            }
        );
        return response.data;
    }
}

export default new AttendanceService();
