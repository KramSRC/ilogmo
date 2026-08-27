/**
 * iLogMo - Notification Zustand Store
 * Client-side cached state for in-app notifications, unread count, and settings.
 */

import { create } from 'zustand';
import { Notification, NotificationSettings } from '@/features/notifications/types';

export interface NotificationStoreState {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  isLoading: boolean;
  error: string | null;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  setSettings: (settings: NotificationSettings) => void;
  updateSettings: (partial: Partial<NotificationSettings>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],
  unreadCount: 0,
  settings: null,
  isLoading: false,
  error: null,

  setNotifications: (notifications) => {
    const unread = notifications.filter((n) => !n.isRead).length;
    set({
      notifications,
      unreadCount: unread,
      isLoading: false,
      error: null,
    });
  },

  setUnreadCount: (unreadCount) => set({ unreadCount }),

  addNotification: (notification) =>
    set((state) => {
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) return state;
      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
      };
    }),

  markNotificationAsRead: (id) =>
    set((state) => {
      let newlyRead = false;
      const updated = state.notifications.map((n) => {
        if (n.id === id && !n.isRead) {
          newlyRead = true;
          return { ...n, isRead: true, readAt: new Date().toISOString() };
        }
        return n;
      });
      return {
        notifications: updated,
        unreadCount: newlyRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),

  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date().toISOString(),
      })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const target = state.notifications.find((n) => n.id === id);
      const isTargetUnread = target ? !target.isRead : false;
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: isTargetUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),

  setSettings: (settings) => set({ settings }),

  updateSettings: (partial) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...partial } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
    }),
}));

export default useNotificationStore;
