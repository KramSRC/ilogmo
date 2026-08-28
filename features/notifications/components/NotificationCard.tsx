/**
 * iLogMo - NotificationCard Component
 * Displays a single notification with type icon, title, message, time, and unread state.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Clock,
  LogOut,
  CheckSquare,
  AlertCircle,
  BookOpen,
  Award,
  Bell,
  Trash2,
} from 'lucide-react-native';
import { Notification } from '../types';
import { formatNotificationTime, getNotificationTypeDetails } from '../utils/notificationUtils';
import { colors } from '@/constants/colors';

export interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onDelete?: (id: string) => void;
}

export function NotificationCard({ notification, onPress, onDelete }: NotificationCardProps) {
  const meta = getNotificationTypeDetails(notification.type, notification.relatedType);
  const timeFormatted = formatNotificationTime(notification.createdAt);

  const renderIcon = () => {
    switch (notification.type) {
      case 'attendance_reminder':
        return <Clock size={20} color={meta.color} strokeWidth={2.2} />;
      case 'checkout_reminder':
        return <LogOut size={20} color={meta.color} strokeWidth={2.2} />;
      case 'task_reminder':
        return <CheckSquare size={20} color={meta.color} strokeWidth={2.2} />;
      case 'overdue_task':
        return <AlertCircle size={20} color={meta.color} strokeWidth={2.2} />;
      case 'journal_reminder':
        return <BookOpen size={20} color={meta.color} strokeWidth={2.2} />;
      case 'ojt_reminder':
        return <Award size={20} color={meta.color} strokeWidth={2.2} />;
      default:
        return <Bell size={20} color={meta.color} strokeWidth={2.2} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}, ${notification.message}. ${timeFormatted}. ${
        notification.isRead ? 'Read' : 'Unread'
      }`}
      className={`rounded-card p-4 mb-3 shadow-card dark:shadow-none border ${
        notification.isRead ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-transparent' : 'bg-primary-50 dark:bg-primary-900/40/40 border-primary-200'
      }`}
    >
      <View className="flex-row items-start justify-between">
        {/* Left: Icon + Content */}
        <View className="flex-row items-start flex-1 mr-2">
          {/* Icon Badge */}
          <View
            className={`w-10 h-10 rounded-2xl ${meta.bg} border items-center justify-center mr-3 mt-0.5`}
          >
            {renderIcon()}
          </View>

          {/* Details */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className={`text-sm font-sans flex-1 mr-2 ${
                  notification.isRead
                    ? 'font-semibold text-neutral-800 dark:text-neutral-200'
                    : 'font-bold text-neutral-900 dark:text-neutral-100'
                }`}
                numberOfLines={1}
              >
                {notification.title}
              </Text>

              {/* Time */}
              <Text className="text-[11px] font-sans text-neutral-400">{timeFormatted}</Text>
            </View>

            {/* Message Body */}
            <Text
              className={`text-xs font-sans leading-relaxed ${
                notification.isRead ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {notification.message}
            </Text>
          </View>
        </View>

        {/* Right: Unread Dot or Delete Button */}
        <View className="items-center justify-center pl-1">
          {!notification.isRead ? (
            <View className="w-2.5 h-2.5 rounded-full bg-primary-600 mb-2" />
          ) : null}

          {onDelete ? (
            <TouchableOpacity
              onPress={() => onDelete(notification.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Delete notification"
              className="p-1"
            >
              <Trash2 size={14} color={colors.neutral[400]} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default NotificationCard;
