import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { NotificationBellButton } from '@/components';
import { colors } from '@/constants/colors';
import { useNotificationStore } from '@/store';

export interface AttendanceHeaderProps {
  hasUnreadNotifications?: boolean;
  unreadCount?: number;
}

export function AttendanceHeader({
  hasUnreadNotifications: propHasUnread,
  unreadCount: propUnreadCount,
}: AttendanceHeaderProps) {
  const router = useRouter();
  const storeUnreadCount = useNotificationStore((state) => state.unreadCount);
  const unreadCount = propUnreadCount ?? storeUnreadCount;
  const hasUnread = propHasUnread ?? unreadCount > 0;

  return (
    <View className="flex-row items-center justify-between mb-5">
      <View className="flex-1 mr-4">
        <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
          Attendance
        </Text>
        <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">
          Track your work hours and attendance
        </Text>
      </View>

      <NotificationBellButton unreadCount={unreadCount} />
    </View>
  );
}

export default AttendanceHeader;
