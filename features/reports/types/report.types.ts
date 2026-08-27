/**
 * iLogMo - Reports Feature Domain Types
 */

import { WorkingDay } from '@/features/ojt/types';

export type ReportFilter = 'all' | 'month' | 'week';

export interface ReportHoursSummary {
  requiredHours: number;
  completedMinutes: number;
  completedHoursFormatted: string;
  completedHoursDecimal: number;
  remainingMinutes: number;
  remainingHoursFormatted: string;
  remainingHoursDecimal: number;
  progressPercentage: number;
}

export interface ReportOjtSummary {
  companyName: string;
  department: string;
  supervisorName?: string | null;
  companyAddress?: string | null;
  startDateFormatted: string;
  expectedEndDateFormatted?: string | null;
  workingDays: WorkingDay[];
  expectedHoursPerDay?: string | null;
}

export interface ReportAttendanceSummary {
  workingDaysCount: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  missingCheckOutCount: number;
  dayOffCount: number;
  totalWorkedMinutes: number;
  totalWorkedHoursFormatted: string;
  averageMinutesPerDay: number;
  averageHoursFormatted: string;
  attendanceRatePercentage: number | null;
  attendanceRateFormatted: string;
}

export interface ReportTaskSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRatePercentage: number;
  completionRateFormatted: string;
}

export interface ReportJournalSummary {
  totalEntries: number;
  entriesThisWeek: number;
  entriesThisMonth: number;
  latestEntryDateFormatted: string | null;
}

export interface ReportStudentInfo {
  id: string;
  fullName: string;
  email: string;
  studentId?: string | null;
  username?: string | null;
}

export interface ReportSummary {
  generatedAt: string; // ISO string
  generatedDateDisplay: string; // "August 28, 2026"
  filter: ReportFilter;
  filterLabel: string; // "All Time" | "This Month" | "This Week"
  dateRangeDisplay: string;
  student: ReportStudentInfo;
  ojt: ReportOjtSummary | null;
  hours: ReportHoursSummary;
  attendance: ReportAttendanceSummary;
  tasks: ReportTaskSummary;
  journal: ReportJournalSummary;
  documentsCount: number;
}

export type ExportFormat = 'pdf' | 'json';

export interface ReportActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
