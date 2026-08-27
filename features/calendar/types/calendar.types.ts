/**
 * iLogMo - Calendar Feature Domain Types
 */

import { AttendanceRecord } from '@/features/attendance/types';
import { WorkingDay } from '@/features/ojt/types';

export type CalendarDayStatus =
  | 'present'
  | 'late'
  | 'absent'
  | 'day_off'
  | 'working'
  | 'completed'
  | 'upcoming'
  | 'before_ojt'
  | 'after_ojt'
  | 'no_record';

export interface CalendarDay {
  dateString: string; // "YYYY-MM-DD"
  dayNumber: number; // 1-31
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWorkingDay: boolean;
  isWithinOjtPeriod: boolean;
  status: CalendarDayStatus;
  attendanceRecord?: AttendanceRecord | null;
  dayOfWeekName: WorkingDay;
  accessibleLabel: string;
}

export interface MonthlyAttendanceSummary {
  presentCount: number;
  lateCount: number;
  absentCount: number;
  dayOffCount: number;
  totalWorkedMinutes: number;
  totalWorkedHoursFormatted: string;
  attendanceRate: number | null; // percentage (0-100) or null if no past scheduled days
  attendanceRateFormatted: string; // e.g. "95%" or "--"
  totalScheduledWorkingDays: number;
  completedOjtHours: number; // Overall completed hours across all records
  requiredOjtHours: number; // From active OJT configuration
}

export interface SelectedDateDetails {
  dateString: string;
  formattedDate: string;
  dayOfWeek: string;
  status: CalendarDayStatus;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isWorkingDay: boolean;
  attendanceRecord?: AttendanceRecord | null;
  statusDescription: string;
  checkInFormatted?: string;
  checkOutFormatted?: string;
  expectedStartTime?: string;
  expectedEndTime?: string;
  totalHoursFormatted?: string;
  breakTimeFormatted?: string;
}
