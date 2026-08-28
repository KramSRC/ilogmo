import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export interface CalendarHeaderProps {
  onPressToday?: () => void;
  showTodayButton?: boolean;
}

export function CalendarHeader({ onPressToday, showTodayButton = false }: CalendarHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between pb-3">
      <View className="flex-row items-center flex-1">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(app)');
            }
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back to previous screen"
          className="w-11 h-11 rounded-full bg-white dark:bg-neutral-900 items-center justify-center border border-neutral-200 dark:border-neutral-800 mr-3 shadow-soft-sm"
          style={{ elevation: 1 }}
        >
          <ArrowLeft size={20} color={colors.neutral[700]} />
        </TouchableOpacity>

        {/* Title & Subtitle */}
        <View className="flex-1">
          <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
            Calendar
          </Text>
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">
            Track your OJT attendance
          </Text>
        </View>
      </View>

      {/* Quick jump to Today button */}
      {showTodayButton && onPressToday ? (
        <TouchableOpacity
          onPress={onPressToday}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Jump to today"
          className="flex-row items-center bg-primary-50 dark:bg-primary-900/40 px-3 py-2 rounded-xl border border-primary-100 dark:border-primary-800/50 min-h-[44px]"
        >
          <CalendarIcon size={14} color={colors.primary[600]} />
          <Text className="text-xs font-semibold font-sans text-primary-600 ml-1.5">Today</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default CalendarHeader;
