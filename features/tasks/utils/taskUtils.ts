/**
 * iLogMo - Task Utilities & Sorting
 */

import { Task, TaskPriority } from '../types';
import { format, isToday, isTomorrow, differenceInCalendarDays, parseISO, isValid } from 'date-fns';

export interface TaskDueStatus {
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean;
  hasDueDate: boolean;
  formattedDate: string;
  badgeLabel: string;
}

/**
 * Evaluates the due date status of a task.
 */
export function getTaskDueStatus(dueDate: string | null, completed: boolean): TaskDueStatus {
  if (!dueDate) {
    return {
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      hasDueDate: false,
      formattedDate: 'No due date',
      badgeLabel: 'No due date',
    };
  }

  try {
    const parts = dueDate.split('-');
    let dateObj: Date;
    if (parts.length === 3) {
      dateObj = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
    } else {
      dateObj = parseISO(dueDate);
    }

    if (!isValid(dateObj)) {
      return {
        isOverdue: false,
        isDueToday: false,
        isDueSoon: false,
        hasDueDate: false,
        formattedDate: dueDate,
        badgeLabel: dueDate,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    const formattedDate = format(dateObj, 'MMM d, yyyy');
    const diffDays = differenceInCalendarDays(dateObj, today);

    if (completed) {
      return {
        isOverdue: false,
        isDueToday: false,
        isDueSoon: false,
        hasDueDate: true,
        formattedDate,
        badgeLabel: `Due ${format(dateObj, 'MMM d')}`,
      };
    }

    if (diffDays < 0) {
      return {
        isOverdue: true,
        isDueToday: false,
        isDueSoon: false,
        hasDueDate: true,
        formattedDate,
        badgeLabel: `Overdue · ${format(dateObj, 'MMM d')}`,
      };
    }

    if (isToday(dateObj) || diffDays === 0) {
      return {
        isOverdue: false,
        isDueToday: true,
        isDueSoon: true,
        hasDueDate: true,
        formattedDate,
        badgeLabel: 'Due today',
      };
    }

    if (isTomorrow(dateObj) || diffDays === 1) {
      return {
        isOverdue: false,
        isDueToday: false,
        isDueSoon: true,
        hasDueDate: true,
        formattedDate,
        badgeLabel: 'Due tomorrow',
      };
    }

    if (diffDays <= 3) {
      return {
        isOverdue: false,
        isDueToday: false,
        isDueSoon: true,
        hasDueDate: true,
        formattedDate,
        badgeLabel: `Due in ${diffDays} days`,
      };
    }

    return {
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      hasDueDate: true,
      formattedDate,
      badgeLabel: `Due ${format(dateObj, 'MMM d')}`,
    };
  } catch {
    return {
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      hasDueDate: true,
      formattedDate: dueDate,
      badgeLabel: dueDate,
    };
  }
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Sorts tasks:
 * - Pending tasks: Overdue -> Due today -> Due soon -> High priority -> Medium -> Low -> No due date.
 * - Completed tasks: Most recently completed first.
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // 1. Separate pending vs completed (pending first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // 2. If both completed: sort newest completed first
    if (a.completed && b.completed) {
      const aTime = a.completedAt || a.updatedAt;
      const bTime = b.completedAt || b.updatedAt;
      return bTime.localeCompare(aTime);
    }

    // 3. Both pending:
    const statusA = getTaskDueStatus(a.dueDate, false);
    const statusB = getTaskDueStatus(b.dueDate, false);

    // Overdue first
    if (statusA.isOverdue !== statusB.isOverdue) {
      return statusA.isOverdue ? -1 : 1;
    }

    // If both have due dates, sort by due date ascending
    if (a.dueDate && b.dueDate) {
      if (a.dueDate !== b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }
    } else if (a.dueDate && !b.dueDate) {
      return -1;
    } else if (!a.dueDate && b.dueDate) {
      return 1;
    }

    // Sort by priority (High -> Medium -> Low)
    const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // Fallback: newest created first
    return b.createdAt.localeCompare(a.createdAt);
  });
}
