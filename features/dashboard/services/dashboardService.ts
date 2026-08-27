/**
 * iLogMo - Dashboard Service
 * Connects Home/Dashboard state with real Attendance, active OJT records, Tasks, Journals, and Reminders.
 */

import { DashboardData, OjtProgress, DashboardTask, TodayAttendance, RecentJournal, UpcomingReminder } from '../types';
import { attendanceService } from '@/features/attendance/services/attendanceService';
import { ojtService } from '@/features/ojt/services/ojtService';
import { taskService } from '@/features/tasks/services/taskService';
import { journalService } from '@/features/journal/services/journalService';
import {
  formatTimeDisplay,
  formatHoursMinutes,
  formatDateDisplay,
  calculateElapsedMinutes,
  getTodayDateString,
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
    let recentJournal: RecentJournal | null = null;
    let reminder: UpcomingReminder | null = null;

    if (userId) {
      const [realToday, history, activeOjt, realTasks, realJournals] = await Promise.all([
        attendanceService.getTodayAttendance(userId),
        attendanceService.getAttendanceHistory(userId, 365),
        ojtService.getActiveOjt(userId),
        taskService.getTasks(userId),
        journalService.getJournalEntries(userId),
      ]);

      // 1. Tasks
      tasks = realTasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        priority: t.priority,
      }));

      // 2. Attendance Today Status
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

      // 3. Compute completed hours from real attendance history
      const totalMinutes = history.reduce((acc, curr) => acc + (curr.totalMinutes || 0), 0);
      completedHours = Math.floor(totalMinutes / 60);

      // 4. Dynamic OJT Configuration
      if (activeOjt) {
        requiredHours = activeOjt.requiredHours;
        if (activeOjt.expectedEndDate) {
          estimatedCompletionDate = formatDateDisplay(activeOjt.expectedEndDate);
        }
      }

      // 5. Real Recent Journal
      if (realJournals && realJournals.length > 0) {
        const latest = realJournals[0];
        recentJournal = {
          id: latest.id,
          date: formatDateDisplay(latest.entryDate),
          preview: latest.workDescription || latest.learningDescription || 'Logged daily reflections.',
          createdAt: latest.createdAt,
        };
      }

      // 6. Context-Aware Reminder
      const todayStr = getTodayDateString();
      const overdueTask = realTasks.find((t) => !t.completed && t.dueDate && t.dueDate < todayStr);
      const todayTask = realTasks.find((t) => !t.completed && t.dueDate && t.dueDate === todayStr);

      if (overdueTask) {
        reminder = {
          id: `task-overdue-${overdueTask.id}`,
          timing: 'Action Required',
          title: `Overdue: ${overdueTask.title}`,
          description: 'This task was due before today. Mark complete once done.',
          icon: 'bell',
        };
      } else if (todayTask) {
        reminder = {
          id: `task-today-${todayTask.id}`,
          timing: 'Due Today',
          title: todayTask.title,
          description: 'Scheduled for completion today.',
          icon: 'calendar',
        };
      } else {
        reminder = {
          id: 'report-reminder',
          timing: 'Progress Report',
          title: 'Review OJT Progress Report',
          description: 'Export official summaries, logbook hours, and supervisor signature forms.',
          icon: 'file',
        };
      }
    }

    return {
      progress: calculateOjtProgress(completedHours, requiredHours, estimatedCompletionDate),
      attendance: attendanceState,
      tasks,
      recentJournal,
      reminder,
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
