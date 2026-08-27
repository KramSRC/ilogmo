import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export interface DashboardHeaderProps {
  firstName?: string;
  hasUnreadNotifications?: boolean;
}

export function DashboardHeader({
  firstName,
  hasUnreadNotifications = true,
}: DashboardHeaderProps) {
  const router = useRouter();

  const greeting = firstName ? `Good morning, ${firstName} 👋` : 'Good morning 👋';

  return (
    <View className="flex-row items-center justify-between mb-6">
      {/* Greeting and Subtitle */}
      <View className="flex-1 mr-4">
        <Text
          className="text-2xl font-bold font-sans text-neutral-900 tracking-tight"
          numberOfLines={1}
        >
          {greeting}
        </Text>
        <Text className="text-sm font-sans text-neutral-500 mt-0.5">
          Ready for another productive OJT day?
        </Text>
      </View>

      {/* Notification Bell Button */}
      <TouchableOpacity
        onPress={() => router.push('/(app)/notifications')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        className="w-11 h-11 rounded-2xl bg-white border border-neutral-200 shadow-soft-sm items-center justify-center relative"
      >
        <Bell size={20} color={colors.neutral[700]} />
        {hasUnreadNotifications ? (
          <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary-600 ring-2 ring-white" />
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

export default DashboardHeader;
