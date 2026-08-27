/**
 * iLogMo - Analytics Feature Domain Types
 */

export interface OjtProgressStats {
  requiredHours: number;
  completedMinutes: number;
  completedHoursFormatted: string;
  remainingMinutes: number;
  remainingHoursFormatted: string;
  progressPercentage: number;
}

export interface AttendanceOverviewStats {
  presentDays: number;
  lateDays: number;
  absentDays: number;
  dayOffDays: number;
  totalAttendedDays: number;
  attendanceRate: number | null;
  attendanceRateFormatted: string;
  averageMinutesPerDay: number;
  averageHoursFormatted: string;
}

export interface DailyWeeklyHours {
  dayLabel: string; // "Mon", "Tue", etc.
  dateString: string; // "YYYY-MM-DD"
  minutes: number;
  hoursFormatted: string;
  isToday: boolean;
  isWorkingDay: boolean;
  percentageOfMax: number; // 0–100 for bar chart
}

export interface WeeklyAnalyticsStats {
  startDate: string;
  endDate: string;
  totalMinutes: number;
  totalHoursFormatted: string;
  days: DailyWeeklyHours[];
}

export interface MonthlyWeekStats {
  weekLabel: string; // "Week 1", "Week 2", etc.
  startDate: string;
  endDate: string;
  totalMinutes: number;
  totalHoursFormatted: string;
  percentageOfMax: number;
}

export interface MonthlyAnalyticsStats {
  monthDate: Date;
  monthFormatted: string; // "August 2026"
  totalMinutes: number;
  totalHoursFormatted: string;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  dayOffDays: number;
  attendanceRate: number | null;
  attendanceRateFormatted: string;
  weeks: MonthlyWeekStats[];
}

export interface CompletionEstimate {
  hasSufficientData: boolean;
  estimatedCompletionDate?: string; // "November 24, 2026"
  estimatedDaysRemaining?: number;
  message: string;
  isOverdueWarning?: boolean;
  expectedEndDate?: string;
}

export interface AnalyticsInsight {
  id: string;
  type: 'progress' | 'attendance' | 'pace' | 'milestone';
  icon: 'trending' | 'check' | 'clock' | 'calendar';
  message: string;
}

export interface AnalyticsData {
  overall: OjtProgressStats;
  attendanceOverview: AttendanceOverviewStats;
  thisWeek: WeeklyAnalyticsStats;
  monthly: MonthlyAnalyticsStats;
  estimate: CompletionEstimate;
  insights: AnalyticsInsight[];
}
