/**
 * iLogMo - Notification Utilities
 * Grouping, date formatting, and icon/styling resolvers for notifications.
 */

import { format, isToday, isYesterday, parseISO, isValid } from 'date-fns';
import { Notification, NotificationType, RelatedRecordType } from '../types';

export interface GroupedNotifications {
  today: Notification[];
  earlier: Notification[];
}

/**
 * Groups notifications into "Today" and "Earlier" lists.
 */
export function groupNotificationsByDate(notifications: Notification[]): GroupedNotifications {
  const today: Notification[] = [];
  const earlier: Notification[] = [];

  notifications.forEach((item) => {
    try {
      const date = parseISO(item.createdAt);
      if (isValid(date) && isToday(date)) {
        today.push(item);
      } else {
        earlier.push(item);
      }
    } catch {
      earlier.push(item);
    }
  });

  return { today, earlier };
}

/**
 * Formats a notification date into a human-friendly display string.
 * e.g., "8:30 AM", "Yesterday", "Aug 24"
 */
export function formatNotificationTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;

    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    const currentYear = new Date().getFullYear();
    if (date.getFullYear() === currentYear) {
      return format(date, 'MMM d');
    }
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export interface NotificationTypeMeta {
  label: string;
  color: string;
  bg: string;
  defaultRoute: string;
}

/**
 * Returns metadata, color styling, and navigation target for a notification type.
 */
export function getNotificationTypeDetails(
  type: NotificationType,
  relatedType?: RelatedRecordType | null
): NotificationTypeMeta {
  switch (type) {
    case 'attendance_reminder':
      return {
        label: 'Attendance Reminder',
        color: '#0284C7', // Sky blue
        bg: 'bg-sky-50 dark:bg-sky-900/40 border-sky-100 dark:border-sky-800/50',
        defaultRoute: '/(app)/attendance',
      };
    case 'checkout_reminder':
      return {
        label: 'Check-Out Reminder',
        color: '#D97706', // Amber
        bg: 'bg-amber-50 dark:bg-amber-900/40 border-amber-100 dark:border-amber-800/50',
        defaultRoute: '/(app)/attendance',
      };
    case 'task_reminder':
      return {
        label: 'Task Reminder',
        color: '#4F46E5', // Indigo
        bg: 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-100 dark:border-indigo-800/50',
        defaultRoute: '/(app)/tasks',
      };
    case 'overdue_task':
      return {
        label: 'Overdue Task',
        color: '#DC2626', // Red
        bg: 'bg-red-50 dark:bg-red-900/40 border-red-100 dark:border-red-800/50',
        defaultRoute: '/(app)/tasks',
      };
    case 'journal_reminder':
      return {
        label: 'Journal Reminder',
        color: '#16A34A', // Green
        bg: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-100 dark:border-emerald-800/50',
        defaultRoute: '/(app)/journal',
      };
    case 'ojt_reminder':
      return {
        label: 'OJT Reminder',
        color: '#9333EA', // Purple
        bg: 'bg-purple-50 border-purple-100 dark:border-purple-800/50',
        defaultRoute: '/(app)/profile',
      };
    default: {
      if (relatedType === 'attendance') {
        return {
          label: 'Attendance',
          color: '#0284C7',
          bg: 'bg-sky-50 dark:bg-sky-900/40 border-sky-100 dark:border-sky-800/50',
          defaultRoute: '/(app)/attendance',
        };
      }
      if (relatedType === 'task') {
        return {
          label: 'Task',
          color: '#4F46E5',
          bg: 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-100 dark:border-indigo-800/50',
          defaultRoute: '/(app)/tasks',
        };
      }
      if (relatedType === 'journal') {
        return {
          label: 'Journal',
          color: '#16A34A',
          bg: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-100 dark:border-emerald-800/50',
          defaultRoute: '/(app)/journal',
        };
      }
      return {
        label: 'Notification',
        color: '#4B5563',
        bg: 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-transparent',
        defaultRoute: '/(app)',
      };
    }
  }
}
