/**
 * iLogMo - ReportFilterTabs Component
 * Segmented filter tabs for switching between All Time, This Month, and This Week.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ReportFilter } from '../types';
import { colors } from '@/constants/colors';

export interface ReportFilterTabsProps {
  selectedFilter: ReportFilter;
  onSelectFilter: (filter: ReportFilter) => void;
}

const FILTERS: { id: ReportFilter; label: string }[] = [
  { id: 'all', label: 'All Time' },
  { id: 'month', label: 'This Month' },
  { id: 'week', label: 'This Week' },
];

export function ReportFilterTabs({ selectedFilter, onSelectFilter }: ReportFilterTabsProps) {
  return (
    <View className="bg-neutral-200/70 p-1 rounded-2xl flex-row items-center mb-4">
      {FILTERS.map((tab) => {
        const isSelected = selectedFilter === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onSelectFilter(tab.id)}
            activeOpacity={0.75}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Filter report by ${tab.label}`}
            style={[
              { minHeight: 38 },
              isSelected && {
                backgroundColor: '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 2,
              },
            ]}
            className={`flex-1 items-center justify-center rounded-xl py-1.5 ${
              isSelected ? '' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-xs font-sans font-semibold ${
                isSelected ? 'text-neutral-900 dark:text-neutral-100 font-bold' : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default ReportFilterTabs;
