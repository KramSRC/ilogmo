/**
 * iLogMo - Dashboard Service
 * Manages calculations, initial/mock data, and data fetching boundaries for the Home screen.
 */

import { DashboardData, OjtProgress, DashboardTask } from '../types';

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

/**
 * Initial/Separated mock dataset representing an active student's OJT journey.
 * Readily replaceable by Supabase queries in subsequent steps.
 */
const INITIAL_DASHBOARD_DATA: DashboardData = {
  progress: calculateOjtProgress(185, 486, 'October 24, 2026'),
  attendance: {
    state: 'not_checked_in', // Can be 'not_checked_in' | 'working' | 'completed'
    statusMessage: 'Start your OJT day by checking in.',
  },
  tasks: [
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
  ],
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

export const dashboardService = {
  /**
   * Fetch dashboard summary for the authenticated user.
   */
  async getDashboardData(_userId?: string): Promise<DashboardData> {
    // Simulate brief network latency in development for smooth transitions
    await new Promise((resolve) => setTimeout(resolve, 200));
    return JSON.parse(JSON.stringify(INITIAL_DASHBOARD_DATA));
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
