/**
 * iLogMo - Attendance Feature Domain Types
 */

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'day_off' | 'working' | 'completed';

export type TodayAttendanceState = 'not_checked_in' | 'working' | 'completed';

export interface AttendanceRecord {
  id: string;
  userId: string;
  attendanceDate: string; // ISO date YYYY-MM-DD
  checkIn: string; // ISO timestamp
  checkOut?: string | null; // ISO timestamp
  breakMinutes: number;
  totalMinutes?: number | null;
  status: AttendanceStatus;
  notes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationAccuracy?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyAttendanceStats {
  totalMinutes: number;
  totalHoursFormatted: string; // e.g. "38h 42m"
  daysPresent: number;
  lateMinutes: number;
  lateHoursFormatted: string; // e.g. "0h 15m"
  attendanceRate: number; // 0–100 percentage
}

export interface MonthlyCalendarDay {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  status?: AttendanceStatus;
  recordId?: string;
}

export interface CheckInPayload {
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  notes?: string;
}

export interface CheckOutPayload {
  notes?: string;
  breakMinutes?: number;
}

export interface AttendanceActionResult<T = AttendanceRecord> {
  success: boolean;
  data?: T;
  error?: string;
}
