/**
 * iLogMo - Dashboard Domain Types
 */

export interface OjtProgress {
  requiredHours: number;
  completedHours: number;
  remainingHours: number;
  progressPercentage: number;
  estimatedCompletionDate: string;
}

export type TodayAttendanceState = 'not_checked_in' | 'working' | 'completed';

export interface TodayAttendance {
  state: TodayAttendanceState;
  checkInTime?: string;
  checkOutTime?: string;
  workingDuration?: string;
  totalHours?: string;
  statusMessage?: string;
}

export interface DashboardTask {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface RecentJournal {
  id: string;
  date: string;
  preview: string;
  mood?: string;
  createdAt: string;
}

export interface UpcomingReminder {
  id: string;
  timing: string;
  title: string;
  description?: string;
  icon?: 'calendar' | 'bell' | 'file';
}

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: 'attendance' | 'journal' | 'calendar' | 'reports';
  route: string;
}

export interface DashboardData {
  progress: OjtProgress;
  attendance: TodayAttendance;
  tasks: DashboardTask[];
  recentJournal: RecentJournal | null;
  reminder: UpcomingReminder | null;
}
