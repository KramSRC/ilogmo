/**
 * iLogMo - Dashboard Service
 * Connects Home/Dashboard state with real Attendance, active OJT records, and feature modules.
 */

import { DashboardData, OjtProgress, DashboardTask, TodayAttendance } from '../types';
import { attendanceService } from '@/features/attendance/services/attendanceService';
import { ojtService } from '@/features/ojt/services/ojtService';
import { taskService } from '@/features/tasks/services/taskService';
import {
  formatTimeDisplay,
  formatHoursMinutes,
  formatDateDisplay,
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
    estimatedCompletionDate: estimatedDate || 'Flexible Schedule',
  };
}

export const dashboardService = {
  /**
   * Fetch dashboard summary for the authenticated user.
   */
  async getDashboardData(userId?: string): Promise<DashboardData> {
    let attendanceState: TodayAttendance = {
      state: 'not_checked_in',
      statusMessage: 'Start your OJT day by checking in.',
    };

    let requiredHours = 486;
    let completedHours = 0;
    let estimatedCompletionDate: string | undefined = undefined;
    let tasks: DashboardTask[] = [];

    if (userId) {
      const [realToday, history, activeOjt, realTasks] = await Promise.all([
        attendanceService.getTodayAttendance(userId),
        attendanceService.getAttendanceHistory(userId, 365),
        ojtService.getActiveOjt(userId),
        taskService.getTasks(userId),
      ]);

      tasks = realTasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        priority: t.priority,
      }));

      // 1. Attendance Today Status
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

      // 2. Compute completed hours from real attendance history
      const totalMinutes = history.reduce((acc, curr) => acc + (curr.totalMinutes || 0), 0);
      completedHours = Math.floor(totalMinutes / 60);

      // 3. Dynamic OJT Configuration
      if (activeOjt) {
        requiredHours = activeOjt.requiredHours;
        if (activeOjt.expectedEndDate) {
          estimatedCompletionDate = formatDateDisplay(activeOjt.expectedEndDate);
        }
      }
    }

    return {
      progress: calculateOjtProgress(completedHours, requiredHours, estimatedCompletionDate),
      attendance: attendanceState,
      tasks,
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
