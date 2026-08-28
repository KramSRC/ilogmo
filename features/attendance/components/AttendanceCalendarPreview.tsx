import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { MonthlyCalendarDay } from '../types';
import { format } from 'date-fns';
import { colors } from '@/constants/colors';

export interface AttendanceCalendarPreviewProps {
  days: MonthlyCalendarDay[];
}

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function AttendanceCalendarPreview({ days }: AttendanceCalendarPreviewProps) {
  const router = useRouter();
  const currentMonthName = format(new Date(), 'MMMM yyyy');

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-8">
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Monthly Calendar</Text>
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">{currentMonthName}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(app)/calendar')}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="flex-row items-center"
        >
          <Calendar size={14} color={colors.primary[600]} />
          <Text className="text-xs font-semibold font-sans text-primary-600 ml-1">
            View Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weekday Header Row */}
      <View className="flex-row justify-between mb-2 pb-1 border-b border-neutral-100 dark:border-neutral-800">
        {WEEK_DAYS.map((dayName) => (
          <View key={dayName} className="flex-1 items-center">
            <Text className="text-[10px] font-bold font-sans text-neutral-400">{dayName}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Days 7-Column Grid */}
      <View className="flex-row flex-wrap">
        {days.map((dayItem, index) => {
          let dotColor = null;
          if (
            dayItem.status === 'present' ||
            dayItem.status === 'completed' ||
            dayItem.status === 'working'
          ) {
            dotColor = 'bg-emerald-50 dark:bg-emerald-900/400';
          } else if (dayItem.status === 'late') {
            dotColor = 'bg-amber-50 dark:bg-amber-900/400';
          } else if (dayItem.status === 'absent') {
            dotColor = 'bg-red-50 dark:bg-red-900/400';
          } else if (dayItem.status === 'day_off') {
            dotColor = 'bg-neutral-300';
          }

          const handleDayPress = () => {
            if (dayItem.recordId) {
              router.push(`/(app)/attendance-details?id=${dayItem.recordId}` as any);
            } else {
              router.push('/(app)/calendar');
            }
          };

          return (
            <TouchableOpacity
              key={`${dayItem.date}-${index}`}
              onPress={handleDayPress}
              activeOpacity={0.7}
              style={{ width: `${100 / 7}%` }}
              className="items-center py-1.5"
            >
              <View
                className={`w-7 h-7 rounded-full items-center justify-center ${
                  dayItem.isToday ? 'bg-primary-600' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-xs font-sans ${
                    dayItem.isToday
                      ? 'text-white font-bold'
                      : dayItem.isCurrentMonth
                        ? 'text-neutral-800 dark:text-neutral-200 font-medium'
                        : 'text-neutral-300'
                  }`}
                >
                  {dayItem.dayNumber}
                </Text>
              </View>

              {/* Status Indicator Dot */}
              <View className="h-1.5 mt-0.5 items-center justify-center">
                {dotColor ? <View className={`w-1.5 h-1.5 rounded-full ${dotColor}`} /> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend Footer */}
      <View className="flex-row justify-between items-center pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-emerald-50 dark:bg-emerald-900/400 mr-1.5" />
          <Text className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400">Present</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-amber-50 dark:bg-amber-900/400 mr-1.5" />
          <Text className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400">Late</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-red-50 dark:bg-red-900/400 mr-1.5" />
          <Text className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400">Absent</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-neutral-300 mr-1.5" />
          <Text className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400">Day Off</Text>
        </View>
      </View>
    </View>
  );
}

export default AttendanceCalendarPreview;
