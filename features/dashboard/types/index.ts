/**
 * Dashboard Feature Domain Types
 */

import { AttendanceRecord } from '../../attendance/types';
import { JournalEntry } from '../../journal/types';

export interface DashboardOverview {
  currentSession?: AttendanceRecord | null;
  recentJournals: JournalEntry[];
  totalOjtHours: number;
  completedOjtHours: number;
  remainingOjtHours: number;
  completionRate: number; // percentage
  streakDays: number;
}
