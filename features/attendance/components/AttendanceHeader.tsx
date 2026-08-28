import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
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

      <TouchableOpacity
        onPress={() => router.push('/(app)/notifications')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        className="w-11 h-11 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-transparent shadow-soft-sm dark:shadow-none items-center justify-center relative"
      >
        <Bell size={20} color={colors.neutral[700]} />
        {hasUnread ? (
          <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-600 border-2 border-white items-center justify-center">
            <Text className="text-[10px] font-bold font-sans text-white leading-none">
              {unreadCount > 9 ? '9+' : unreadCount > 0 ? unreadCount : ''}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

export default AttendanceHeader;
