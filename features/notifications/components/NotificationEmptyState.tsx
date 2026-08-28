/**
 * iLogMo - NotificationEmptyState Component
 * Empty state displayed when user has no notifications.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { BellOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export function NotificationEmptyState() {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-8 shadow-card border border-neutral-200 dark:border-neutral-800 items-center text-center my-6">
      <View className="w-14 h-14 rounded-2xl bg-neutral-100 items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-800">
        <BellOff size={26} color={colors.neutral[500]} />
      </View>

      <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-1.5 text-center">
        No notifications yet.
      </Text>

      <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 text-center leading-5 px-4">
        Important reminders and updates about your OJT schedule, tasks, and journal will appear
        here.
      </Text>
    </View>
  );
}

export default NotificationEmptyState;
