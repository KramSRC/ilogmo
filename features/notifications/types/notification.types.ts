/**
 * iLogMo - Notifications Domain Types
 */

export type NotificationType =
  | 'attendance_reminder'
  | 'checkout_reminder'
  | 'task_reminder'
  | 'overdue_task'
  | 'journal_reminder'
  | 'ojt_reminder';

export type RelatedRecordType = 'attendance' | 'task' | 'journal' | 'ojt';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: string | null;
  relatedType: RelatedRecordType | null;
  readAt: string | null; // ISO timestamp
  isRead: boolean;
  createdAt: string; // ISO timestamp
}

export interface NotificationSettings {
  id?: string;
  userId: string;
  attendanceReminders: boolean;
  checkoutReminders: boolean;
  taskReminders: boolean;
  journalReminders: boolean;
  ojtReminders: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: RelatedRecordType;
}

export interface NotificationActionResult<T = Notification> {
  success: boolean;
  data?: T;
  error?: string;
}
