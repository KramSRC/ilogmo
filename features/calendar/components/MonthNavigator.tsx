import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

export interface MonthNavigatorProps {
  selectedMonth: Date;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthNavigator({
  selectedMonth,
  canGoPrev,
  canGoNext,
  onPrevMonth,
  onNextMonth,
}: MonthNavigatorProps) {
  const isDark = useThemeStore((state) => state.isDark);
  const monthYearDisplay = format(selectedMonth, 'MMMM yyyy');

  return (
    <View className="flex-row items-center justify-between py-2 mb-2">
      {/* Previous Month Button */}
      <TouchableOpacity
        onPress={onPrevMonth}
        disabled={!canGoPrev}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Previous month"
        accessibilityState={{ disabled: !canGoPrev }}
        className={`w-11 h-11 rounded-xl items-center justify-center border ${
          canGoPrev ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-transparent' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-transparent opacity-40'
        }`}
      >
        <ChevronLeft size={20} color={canGoPrev ? (isDark ? colors.neutral[300] : colors.neutral[800]) : (isDark ? colors.neutral[600] : colors.neutral[400])} />
      </TouchableOpacity>

      {/* Month Year Display */}
      <View className="items-center">
        <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100">{monthYearDisplay}</Text>
      </View>

      {/* Next Month Button */}
      <TouchableOpacity
        onPress={onNextMonth}
        disabled={!canGoNext}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Next month"
        accessibilityState={{ disabled: !canGoNext }}
        className={`w-11 h-11 rounded-xl items-center justify-center border ${
          canGoNext ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-transparent' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-transparent opacity-40'
        }`}
      >
        <ChevronRight size={20} color={canGoNext ? (isDark ? colors.neutral[300] : colors.neutral[800]) : (isDark ? colors.neutral[600] : colors.neutral[400])} />
      </TouchableOpacity>
    </View>
  );
}

export default MonthNavigator;
