/**
 * iLogMo - Local Reminder Scheduling Service
 * Manages local notifications using Expo Notifications API with stable identifiers and deduplication.
 */

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { parseISO, subDays, isValid } from 'date-fns';
import { NotificationSettings } from '../types';
import { OjtRecord } from '@/features/ojt/types';
import { Task } from '@/features/tasks/types';

// Configure foreground notification behavior safely
if (Platform.OS !== 'web') {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (err) {
    console.warn('[reminderService] Could not set notification handler:', err);
  }
}

export const reminderService = {
  /**
   * Check if notification permission is granted.
   */
  async getPermissionStatusAsync(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn('[reminderService.getPermissionStatusAsync] Error:', err);
      return false;
    }
  },

  /**
   * Request permission from user to send notifications.
   */
  async requestPermissionsAsync(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus === 'granted') return true;

      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn('[reminderService.requestPermissionsAsync] Error:', err);
      return false;
    }
  },

  /**
   * Cancel a scheduled notification by identifier.
   */
  async cancelReminder(identifier: string): Promise<void> {
    if (Platform.OS === 'web' || !identifier) return;

    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (err) {
      console.warn(`[reminderService.cancelReminder] Could not cancel ${identifier}:`, err);
    }
  },

  /**
   * Cancel reminder for a specific task.
   */
  async cancelTaskReminder(taskId: string): Promise<void> {
    if (!taskId) return;
    await this.cancelReminder(`task-due-${taskId}`);
    await this.cancelReminder(`task-overdue-${taskId}`);
  },

  /**
   * Schedule task due date reminder (1 day before due date at 9:00 AM).
   */
  async scheduleTaskReminder(task: Task, settings: NotificationSettings): Promise<string | null> {
    if (Platform.OS === 'web') return null;
    if (!settings.taskReminders || task.completed || !task.dueDate) return null;

    const identifier = `task-due-${task.id}`;
    await this.cancelReminder(identifier);

    try {
      const parsedDueDate = parseISO(task.dueDate);
      if (!isValid(parsedDueDate)) return null;

      // 1 day before due date
      const reminderDate = subDays(parsedDueDate, 1);
      reminderDate.setHours(9, 0, 0, 0);

      // Only schedule if in future
      if (reminderDate.getTime() <= Date.now()) {
        return null;
      }

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: '📋 Task Due Tomorrow',
          body: `"${task.title}" is due tomorrow.`,
          data: {
            type: 'task_reminder',
            relatedId: task.id,
            relatedType: 'task',
            route: '/(app)/tasks',
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDate,
        },
      });

      return identifier;
    } catch (err) {
      console.warn('[reminderService.scheduleTaskReminder] Error:', err);
      return null;
    }
  },

  /**
   * Reschedule all reminders based on latest OJT record and tasks.
   */
  async rescheduleAllReminders(
    ojtRecord: OjtRecord | null,
    tasks: Task[],
    settings: NotificationSettings
  ): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      const hasPermission = await this.getPermissionStatusAsync();
      if (!hasPermission) return;

      // 1. Task Reminders
      for (const task of tasks) {
        if (!task.completed && task.dueDate) {
          await this.scheduleTaskReminder(task, settings);
        } else {
          await this.cancelTaskReminder(task.id);
        }
      }

      // 2. Attendance & OJT Reminders if OJT setup is active
      if (ojtRecord && ojtRecord.isActive) {
        // Attendance start reminder
        if (settings.attendanceReminders && ojtRecord.expectedStartTime) {
          await this.scheduleAttendanceDailyReminder(ojtRecord);
        } else {
          await this.cancelReminder('ojt-attendance-start-daily');
        }

        // Check-out reminder
        if (settings.checkoutReminders && ojtRecord.expectedEndTime) {
          await this.scheduleCheckoutDailyReminder(ojtRecord);
        } else {
          await this.cancelReminder('ojt-attendance-checkout-daily');
        }

        // Journal reminder
        if (settings.journalReminders && ojtRecord.expectedEndTime) {
          await this.scheduleJournalDailyReminder(ojtRecord);
        } else {
          await this.cancelReminder('ojt-journal-daily');
        }
      }
    } catch (err) {
      console.warn('[reminderService.rescheduleAllReminders] Error:', err);
    }
  },

  /**
   * Schedule recurring daily attendance start reminder.
   * Default: 30 minutes before expected start time.
   */
  async scheduleAttendanceDailyReminder(ojt: OjtRecord): Promise<void> {
    if (Platform.OS === 'web' || !ojt.expectedStartTime) return;

    const identifier = 'ojt-attendance-start-daily';
    await this.cancelReminder(identifier);

    try {
      const [startHourStr, startMinStr] = ojt.expectedStartTime.split(':');
      let hour = parseInt(startHourStr, 10);
      let minute = parseInt(startMinStr, 10) - 30;

      if (minute < 0) {
        minute += 60;
        hour -= 1;
      }
      if (hour < 0) hour += 24;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: '🔔 Attendance Reminder',
          body: 'Your scheduled OJT start time is in 30 minutes. Get ready for your shift!',
          data: {
            type: 'attendance_reminder',
            relatedId: ojt.id,
            relatedType: 'attendance',
            route: '/(app)/attendance',
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    } catch (err) {
      console.warn('[reminderService.scheduleAttendanceDailyReminder] Error:', err);
    }
  },

  /**
   * Schedule recurring daily check-out reminder.
   * Default: 15 minutes before expected end time.
   */
  async scheduleCheckoutDailyReminder(ojt: OjtRecord): Promise<void> {
    if (Platform.OS === 'web' || !ojt.expectedEndTime) return;

    const identifier = 'ojt-attendance-checkout-daily';
    await this.cancelReminder(identifier);

    try {
      const [endHourStr, endMinStr] = ojt.expectedEndTime.split(':');
      let hour = parseInt(endHourStr, 10);
      let minute = parseInt(endMinStr, 10) - 15;

      if (minute < 0) {
        minute += 60;
        hour -= 1;
      }
      if (hour < 0) hour += 24;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: '⏱️ Check-Out Reminder',
          body: "Your scheduled OJT end time is approaching. Don't forget to check out.",
          data: {
            type: 'checkout_reminder',
            relatedId: ojt.id,
            relatedType: 'attendance',
            route: '/(app)/attendance',
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    } catch (err) {
      console.warn('[reminderService.scheduleCheckoutDailyReminder] Error:', err);
    }
  },

  /**
   * Schedule recurring daily journal reminder.
   * Default: 30 minutes after expected end time.
   */
  async scheduleJournalDailyReminder(ojt: OjtRecord): Promise<void> {
    if (Platform.OS === 'web' || !ojt.expectedEndTime) return;

    const identifier = 'ojt-journal-daily';
    await this.cancelReminder(identifier);

    try {
      const [endHourStr, endMinStr] = ojt.expectedEndTime.split(':');
      let hour = parseInt(endHourStr, 10);
      let minute = parseInt(endMinStr, 10) + 30;

      if (minute >= 60) {
        minute -= 60;
        hour += 1;
      }
      if (hour >= 24) hour -= 24;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: '📓 Journal Reminder',
          body: "Don't forget to record what you worked on and learned today.",
          data: {
            type: 'journal_reminder',
            relatedId: ojt.id,
            relatedType: 'journal',
            route: '/(app)/journal-entry',
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    } catch (err) {
      console.warn('[reminderService.scheduleJournalDailyReminder] Error:', err);
    }
  },
};

export default reminderService;
