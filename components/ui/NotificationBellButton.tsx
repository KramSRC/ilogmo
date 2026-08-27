import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useNotificationStore } from '@/store';

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
  const unreadCount = propUnreadCount ?? storeUnreadCount;
  const isUnread = propHasUnread ?? unreadCount > 0;

  return (
    <TouchableOpacity
      onPress={() => router.push('/(app)/notifications')}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      className={`w-11 h-11 rounded-2xl bg-white border border-neutral-200 shadow-soft-sm items-center justify-center relative ${className || ''}`}
    >
      <Bell size={20} color={colors.neutral[700]} />
      {isUnread ? (
        <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-600 border-2 border-white items-center justify-center">
          <Text className="text-[10px] font-bold font-sans text-white leading-none">
            {unreadCount > 9 ? '9+' : unreadCount > 0 ? unreadCount : ''}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default NotificationBellButton;
