/**
 * Attendance Feature Domain Types
 */

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // ISO date YYYY-MM-DD
  checkInTime: string; // ISO timestamp
  checkOutTime?: string | null; // ISO timestamp
  totalMinutes?: number | null;
  status: 'present' | 'late' | 'absent' | 'half-day';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  totalHoursCompleted: number;
  totalRequiredHours: number;
  remainingHours: number;
  completedDays: number;
  averageHoursPerDay: number;
}
