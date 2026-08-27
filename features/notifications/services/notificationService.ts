/**
 * iLogMo - Notification Service
 * Handles Supabase database interactions for in-app notifications and notification settings.
 */

import { supabase } from '@/lib/supabase';
import {
  Notification,
  NotificationType,
  RelatedRecordType,
  NotificationSettings,
  CreateNotificationPayload,
  NotificationActionResult,
} from '../types';

/**
 * Maps raw Supabase row to domain Notification model.
 */
function mapRowToNotification(row: any): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as NotificationType,
    title: row.title,
    message: row.message,
    relatedId: row.related_id || null,
    relatedType: (row.related_type as RelatedRecordType) || null,
    readAt: row.read_at || null,
    isRead: Boolean(row.read_at),
    createdAt: row.created_at,
  };
}

/**
 * Maps raw Supabase row to domain NotificationSettings model.
 */
function mapRowToSettings(row: any, userId: string): NotificationSettings {
  if (!row) {
    return {
      userId,
      attendanceReminders: true,
      checkoutReminders: true,
      taskReminders: true,
      journalReminders: true,
      ojtReminders: true,
    };
  }
  return {
    id: row.id,
    userId: row.user_id,
    attendanceReminders: row.attendance_reminders ?? true,
    checkoutReminders: row.checkout_reminders ?? true,
    taskReminders: row.task_reminders ?? true,
    journalReminders: row.journal_reminders ?? true,
    ojtReminders: row.ojt_reminders ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const notificationService = {
  /**
   * Fetch all notifications for a user, ordered by newest first.
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[notificationService.getNotifications] Error:', error.message);
        return [];
      }

      return (data || []).map(mapRowToNotification);
    } catch (err) {
      console.warn('[notificationService.getNotifications] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch unread notification count.
   */
  async getUnreadNotificationCount(userId: string): Promise<number> {
    try {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('read_at', null);

      if (error) {
        console.warn('[notificationService.getUnreadNotificationCount] Error:', error.message);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.warn('[notificationService.getUnreadNotificationCount] Unexpected error:', err);
      return 0;
    }
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    try {
      if (!userId || !notificationId) return false;

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .is('read_at', null);

      if (error) {
        console.warn('[notificationService.markAsRead] Error:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.warn('[notificationService.markAsRead] Unexpected error:', err);
      return false;
    }
  },

  /**
   * Mark all unread notifications as read.
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      if (!userId) return false;

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('read_at', null);

      if (error) {
        console.warn('[notificationService.markAllAsRead] Error:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.warn('[notificationService.markAllAsRead] Unexpected error:', err);
      return false;
    }
  },

  /**
   * Delete a notification.
   */
  async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    try {
      if (!userId || !notificationId) return false;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.warn('[notificationService.deleteNotification] Error:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.warn('[notificationService.deleteNotification] Unexpected error:', err);
      return false;
    }
  },

  /**
   * Create a new notification record in the database.
   */
  async createNotification(
    userId: string,
    payload: CreateNotificationPayload
  ): Promise<NotificationActionResult<Notification>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: payload.type,
          title: payload.title.trim(),
          message: payload.message.trim(),
          related_id: payload.relatedId || null,
          related_type: payload.relatedType || null,
        })
        .select('*')
        .single();

      if (error) {
        console.warn('[notificationService.createNotification] Error:', error.message);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: mapRowToNotification(data),
      };
    } catch (err: any) {
      console.warn('[notificationService.createNotification] Unexpected error:', err);
      return { success: false, error: err?.message || 'Unable to create notification.' };
    }
  },

  /**
   * Fetch notification settings for user, creating defaults if not yet present.
   */
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      if (!userId) {
        return mapRowToSettings(null, userId);
      }

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[notificationService.getNotificationSettings] Error:', error.message);
        return mapRowToSettings(null, userId);
      }

      if (!data) {
        // Create initial default settings
        const { data: inserted, error: insertError } = await supabase
          .from('notification_settings')
          .insert({
            user_id: userId,
            attendance_reminders: true,
            checkout_reminders: true,
            task_reminders: true,
            journal_reminders: true,
            ojt_reminders: true,
          })
          .select('*')
          .single();

        if (insertError) {
          return mapRowToSettings(null, userId);
        }
        return mapRowToSettings(inserted, userId);
      }

      return mapRowToSettings(data, userId);
    } catch (err) {
      console.warn('[notificationService.getNotificationSettings] Unexpected error:', err);
      return mapRowToSettings(null, userId);
    }
  },

  /**
   * Update notification settings for a user.
   */
  async updateNotificationSettings(
    userId: string,
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    try {
      if (!userId) {
        return mapRowToSettings(null, userId);
      }

      const payload: any = {};
      if (settings.attendanceReminders !== undefined) {
        payload.attendance_reminders = settings.attendanceReminders;
      }
      if (settings.checkoutReminders !== undefined) {
        payload.checkout_reminders = settings.checkoutReminders;
      }
      if (settings.taskReminders !== undefined) {
        payload.task_reminders = settings.taskReminders;
      }
      if (settings.journalReminders !== undefined) {
        payload.journal_reminders = settings.journalReminders;
      }
      if (settings.ojtReminders !== undefined) {
        payload.ojt_reminders = settings.ojtReminders;
      }

      const { data, error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: userId,
          ...payload,
        })
        .select('*')
        .single();

      if (error) {
        console.warn('[notificationService.updateNotificationSettings] Error:', error.message);
        return mapRowToSettings(null, userId);
      }

      return mapRowToSettings(data, userId);
    } catch (err) {
      console.warn('[notificationService.updateNotificationSettings] Unexpected error:', err);
      return mapRowToSettings(null, userId);
    }
  },
};

export default notificationService;
