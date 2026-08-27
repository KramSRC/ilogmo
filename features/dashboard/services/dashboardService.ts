/**
 * iLogMo - Dashboard Service
 * Connects Home/Dashboard state with real Attendance and feature modules.
 */

import { DashboardData, OjtProgress, DashboardTask, TodayAttendance } from '../types';
import { attendanceService } from '@/features/attendance/services/attendanceService';
import {
  formatTimeDisplay,
  formatHoursMinutes,
  calculateElapsedMinutes,
} from '@/features/attendance/utils/timeUtils';

/**
 * Calculates OJT progress metrics with 0–100% clamping and safe non-negative remaining hours.
 */
export function calculateOjtProgress(
  completed: number,
  required: number,
  estimatedDate?: string
): OjtProgress {
  const safeRequired = Math.max(1, required);
  const safeCompleted = Math.max(0, completed);
  const remaining = Math.max(0, safeRequired - safeCompleted);
  const rawPercentage = (safeCompleted / safeRequired) * 100;
  const clampedPercentage = Math.min(100, Math.max(0, Math.round(rawPercentage)));

  return {
    requiredHours: safeRequired,
    completedHours: safeCompleted,
    remainingHours: remaining,
    progressPercentage: clampedPercentage,
    estimatedCompletionDate: estimatedDate || 'October 24, 2026',
  };
}

const INITIAL_TASKS: DashboardTask[] = [
  {
    id: 'task-1',
    title: 'Review project requirements',
    completed: true,
    priority: 'high',
  },
  {
    id: 'task-2',
    title: 'Complete assigned module',
    completed: false,
    priority: 'high',
  },
  {
    id: 'task-3',
    title: 'Update documentation',
    completed: false,
    priority: 'medium',
  },
];

export const dashboardService = {
  /**
   * Fetch dashboard summary for the authenticated user.
   */
  async getDashboardData(userId?: string): Promise<DashboardData> {
    let attendanceState: TodayAttendance = {
      state: 'not_checked_in',
      statusMessage: 'Start your OJT day by checking in.',
    };

    if (userId) {
      const realToday = await attendanceService.getTodayAttendance(userId);
      if (realToday) {
        if (realToday.status === 'working') {
          const elapsed = calculateElapsedMinutes(realToday.checkIn, null, realToday.breakMinutes);
          attendanceState = {
            state: 'working',
            checkInTime: formatTimeDisplay(realToday.checkIn),
            workingDuration: formatHoursMinutes(elapsed),
          };
        } else if (realToday.status === 'completed') {
          attendanceState = {
            state: 'completed',
            checkInTime: formatTimeDisplay(realToday.checkIn),
            checkOutTime: formatTimeDisplay(realToday.checkOut),
            totalHours: formatHoursMinutes(realToday.totalMinutes ?? 0),
          };
        }
      }
    }

    return {
      progress: calculateOjtProgress(185, 486, 'October 24, 2026'),
      attendance: attendanceState,
      tasks: INITIAL_TASKS,
      recentJournal: {
        id: 'journal-1',
        date: 'Yesterday',
        preview:
          'Worked on the attendance module and learned how to properly structure database queries.',
        mood: 'productive',
        createdAt: '2026-08-27T17:00:00.000Z',
      },
      reminder: {
        id: 'rem-1',
        timing: 'Tomorrow',
        title: 'Submit weekly OJT report',
        description: 'Prepare your 4th weekly logbook submission for supervisor sign-off.',
        icon: 'file',
      },
    };
  },

  /**
   * Update task completion status (optimistic local update).
   */
  async toggleTask(tasks: DashboardTask[], taskId: string): Promise<DashboardTask[]> {
    return tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
  },
};

export default dashboardService;
