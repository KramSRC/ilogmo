import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/colors';

const LEGEND_ITEMS = [
  { label: 'Present', color: colors.success.DEFAULT },
  { label: 'Late', color: colors.warning.DEFAULT },
  { label: 'Absent', color: colors.error.DEFAULT },
  { label: 'Day Off', color: colors.neutral[300] },
  { label: 'Working', color: colors.primary[600] },
];

export function CalendarLegend() {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card px-4 py-3 shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800 mb-5">
      <View className="flex-row justify-between items-center flex-wrap">
        {LEGEND_ITEMS.map((item) => (
          <View key={item.label} className="flex-row items-center my-0.5 mr-2">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: item.color,
                marginRight: 6,
              }}
            />
            <Text className="text-[11px] font-medium font-sans text-neutral-600 dark:text-neutral-400">{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default CalendarLegend;
