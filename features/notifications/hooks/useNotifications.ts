/**
 * iLogMo - useNotifications Hook
 * Provides notification state, date grouping, unread tracking, mark as read, and settings management.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore, useNotificationStore, useOjtStore, useTaskStore } from '@/store';
import { notificationService, reminderService } from '../services';
import { groupNotificationsByDate } from '../utils/notificationUtils';
import { NotificationSettings } from '../types';

export function useNotifications() {
  const { user } = useAuthStore();
  const { activeOjt } = useOjtStore();
  const { tasks } = useTaskStore();

  const {
    notifications,
    unreadCount,
    settings,
    isLoading: storeLoading,
    error: storeError,
    setNotifications,
    setSettings,
    updateSettings: updateStoreSettings,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    setLoading,
    setError,
  } = useNotificationStore();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  /**
   * Load notifications and settings from Supabase.
   */
  const loadData = useCallback(
    async (showLoadingSpinner: boolean = true) => {
      if (!user?.id) return;

      if (showLoadingSpinner) {
        setLoading(true);
      }
      setError(null);

      try {
        const [items, userSettings] = await Promise.all([
          notificationService.getNotifications(user.id),
          notificationService.getNotificationSettings(user.id),
        ]);

        setNotifications(items);
        setSettings(userSettings);

        // Schedule / synchronize local notifications
        await reminderService.rescheduleAllReminders(activeOjt, tasks, userSettings);
      } catch (err: any) {
        console.warn('[useNotifications.loadData] Error:', err);
        setError('Unable to load notifications. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [user, activeOjt, tasks, setLoading, setError, setNotifications, setSettings]
  );

  // Initial load
  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user, loadData]);

  /**
   * Pull-to-refresh handler.
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData(false);
    setIsRefreshing(false);
  }, [loadData]);

  /**
   * Mark a single notification as read.
   */
  const markAsRead = useCallback(
    async (id: string) => {
      if (!user?.id || !id) return;

      // Optimistic update
      markNotificationAsRead(id);
      await notificationService.markAsRead(user.id, id);
    },
    [user, markNotificationAsRead]
  );

  /**
   * Mark all unread notifications as read.
   */
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    // Optimistic update
    markAllNotificationsAsRead();
    await notificationService.markAllAsRead(user.id);
  }, [user, markAllNotificationsAsRead]);

  /**
   * Delete a notification.
   */
  const deleteNotification = useCallback(
    async (id: string) => {
      if (!user?.id || !id) return;

      // Optimistic update
      removeNotification(id);
      await notificationService.deleteNotification(user.id, id);
    },
    [user, removeNotification]
  );

  /**
   * Update notification settings.
   */
  const updateSettings = useCallback(
    async (partial: Partial<NotificationSettings>) => {
      if (!user?.id) return;

      updateStoreSettings(partial);
      const updated = await notificationService.updateNotificationSettings(user.id, partial);
      setSettings(updated);

      // Reschedule reminders based on new settings
      await reminderService.rescheduleAllReminders(activeOjt, tasks, updated);
    },
    [user, activeOjt, tasks, updateStoreSettings, setSettings]
  );

  /**
   * Request notification permissions.
   */
  const requestPermissions = useCallback(async () => {
    return await reminderService.requestPermissionsAsync();
  }, []);

  /**
   * Group notifications into "Today" and "Earlier".
   */
  const grouped = useMemo(() => {
    return groupNotificationsByDate(notifications);
  }, [notifications]);

  return {
    notifications,
    todayNotifications: grouped.today,
    earlierNotifications: grouped.earlier,
    unreadCount,
    settings,
    isLoading: storeLoading,
    isRefreshing,
    error: storeError,
    loadData,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    requestPermissions,
  };
}

export default useNotifications;
