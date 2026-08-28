import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useNotificationStore } from '@/store';

export interface DashboardHeaderProps {
  firstName?: string;
  hasUnreadNotifications?: boolean;
  unreadCount?: number;
}

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (hour >= 12 && hour < 18) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 18 || hour < 5) {
    timeGreeting = 'Good evening';
  }
  return name ? `${timeGreeting}, ${name} 👋` : `${timeGreeting} 👋`;
}

export function DashboardHeader({ firstName, unreadCount: propUnreadCount }: DashboardHeaderProps) {
  const router = useRouter();
  const storeUnreadCount = useNotificationStore((state) => state.unreadCount);
  const unreadCount = propUnreadCount ?? storeUnreadCount;
  const hasUnread = unreadCount > 0;

  const greeting = getGreeting(firstName);

  return (
    <View className="flex-row items-center justify-between mb-6">
      {/* Greeting and Subtitle */}
      <View className="flex-1 mr-4">
        <Text
          className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight"
          numberOfLines={1}
        >
          {greeting}
        </Text>
        <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">
          Ready for another productive OJT day?
        </Text>
      </View>

      {/* Notification Bell Button */}
      <TouchableOpacity
        onPress={() => router.push('/(app)/notifications')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        style={{ minHeight: 44, minWidth: 44 }}
        className="w-11 h-11 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft-sm dark:shadow-none items-center justify-center relative"
      >
        <Bell size={20} color={colors.neutral[700]} />
        {hasUnread ? (
          <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-600 border-2 border-white items-center justify-center">
            <Text className="text-[10px] font-bold font-sans text-white leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

export default DashboardHeader;
