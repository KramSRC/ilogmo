import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CalendarDay } from '../types/calendar.types';
import { colors } from '@/constants/colors';

export interface CalendarGridProps {
  days: CalendarDay[];
  onSelectDate: (dateStr: string) => void;
}

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function CalendarGrid({ days, onSelectDate }: CalendarGridProps) {
  return (
    <View className="bg-white rounded-card p-4 shadow-card border border-neutral-200 mb-4">
      {/* Weekday Header Row */}
      <View className="flex-row justify-between mb-3 pb-2 border-b border-neutral-100">
        {WEEK_DAYS.map((dayName) => (
          <View key={dayName} className="flex-1 items-center">
            <Text className="text-[11px] font-bold font-sans text-neutral-400">{dayName}</Text>
          </View>
        ))}
      </View>

      {/* 7-Column Calendar Days Grid */}
      <View className="flex-row flex-wrap">
        {days.map((dayItem) => {
          // Status indicator color
          let dotColor: string | null = null;

          if (dayItem.status === 'present' || dayItem.status === 'completed') {
            dotColor = colors.success.DEFAULT; // Emerald #22C55E
          } else if (dayItem.status === 'working') {
            dotColor = colors.primary[600]; // Blue #2563EB
          } else if (dayItem.status === 'late') {
            dotColor = colors.warning.DEFAULT; // Amber #F59E0B
          } else if (dayItem.status === 'absent') {
            dotColor = colors.error.DEFAULT; // Red #EF4444
          } else if (dayItem.status === 'day_off') {
            dotColor = colors.neutral[300]; // Neutral #CBD5E1
          }

          // Container and text styles based on selection & today states
          const isSelected = dayItem.isSelected;
          const isToday = dayItem.isToday;
          const isCurrentMonth = dayItem.isCurrentMonth;

          let cellBg = 'bg-transparent';
          let textColor = isCurrentMonth ? 'text-neutral-800' : 'text-neutral-300';
          let fontWeight = 'font-normal';
          let borderColor = 'border-transparent';

          if (isSelected) {
            cellBg = 'bg-primary-600';
            textColor = 'text-white';
            fontWeight = 'font-bold';
          } else if (isToday) {
            cellBg = 'bg-primary-50';
            borderColor = 'border-primary-400';
            textColor = 'text-primary-700';
            fontWeight = 'font-bold';
          }

          return (
            <TouchableOpacity
              key={dayItem.dateString}
              onPress={() => onSelectDate(dayItem.dateString)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={dayItem.accessibleLabel}
              accessibilityState={{ selected: isSelected }}
              style={{ width: `${100 / 7}%`, minHeight: 48 }}
              className="items-center justify-center py-1"
            >
              {/* Day Number Circle */}
              <View
                className={`w-9 h-9 rounded-full items-center justify-center border ${cellBg} ${borderColor}`}
              >
                <Text className={`text-xs font-sans ${textColor} ${fontWeight}`}>
                  {dayItem.dayNumber}
                </Text>
              </View>

              {/* Attendance Status Dot */}
              <View className="h-2 mt-0.5 items-center justify-center">
                {dotColor ? (
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 2.5,
                      backgroundColor: isSelected ? '#FFFFFF' : dotColor,
                    }}
                  />
                ) : (
                  <View style={{ width: 5, height: 5 }} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default CalendarGrid;
