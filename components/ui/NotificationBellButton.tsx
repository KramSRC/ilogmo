import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useNotificationStore } from '@/store';
import { useThemeStore } from '@/store/themeStore';

export interface NotificationBellButtonProps {
  hasUnread?: boolean;
  unreadCount?: number;
  className?: string;
}

export function NotificationBellButton({
  hasUnread: propHasUnread,
  unreadCount: propUnreadCount,
  className,
}: NotificationBellButtonProps) {
  const router = useRouter();
  const storeUnreadCount = useNotificationStore((state) => state.unreadCount);
  const isDark = useThemeStore((state) => state.isDark);
  const unreadCount = propUnreadCount ?? storeUnreadCount;
  const isUnread = propHasUnread ?? unreadCount > 0;

  return (
    <TouchableOpacity
      onPress={() => router.push('/(app)/notifications')}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      style={{ width: 44, height: 44, minWidth: 44, minHeight: 44 }}
      className={`rounded-2xl bg-white dark:bg-transparent border border-neutral-200 dark:border-transparent shadow-soft-sm dark:shadow-none items-center justify-center relative ${
        className || ''
      }`}
    >
      <Bell size={20} color={isDark ? colors.neutral[200] : colors.neutral[700]} />
      {isUnread ? (
        <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-600 border-2 border-white dark:border-neutral-900 items-center justify-center">
          <Text className="text-[10px] font-bold font-sans text-white leading-none">
            {unreadCount > 9 ? '9+' : unreadCount > 0 ? unreadCount : ''}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default NotificationBellButton;
