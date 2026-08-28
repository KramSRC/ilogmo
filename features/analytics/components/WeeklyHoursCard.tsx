/**
 * iLogMo - Weekly Hours Analytics Card
 * Displays the current week's daily distribution and clean bar chart visualization.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { BarChart2 } from 'lucide-react-native';
import { WeeklyAnalyticsStats } from '../types';

export interface WeeklyHoursCardProps {
  weekly: WeeklyAnalyticsStats;
}

export function WeeklyHoursCard({ weekly }: WeeklyHoursCardProps) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card border border-neutral-200 dark:border-neutral-800 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 items-center justify-center mr-2.5 border border-indigo-100 dark:border-indigo-800/50">
            <BarChart2 size={16} color="#4F46E5" />
          </View>
          <View>
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">This Week</Text>
            <Text className="text-xs font-sans text-neutral-400">Daily hours distribution</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xs font-sans text-neutral-400">Total</Text>
          <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">
            {weekly.totalHoursFormatted}
          </Text>
        </View>
      </View>

      {/* Accessible Text Summary */}
      <Text className="sr-only">
        This week you have logged a total of {weekly.totalHoursFormatted}.
      </Text>

      {/* Bar Chart Visualization */}
      <View className="flex-row items-end justify-between pt-4 pb-2 px-1 h-36">
        {weekly.days.map((day) => {
          const barHeightPct = Math.max(8, day.percentageOfMax); // minimum height for visibility
          const isHighlight = day.isToday;
          const hasHours = day.minutes > 0;

          return (
            <View key={day.dateString} className="flex-1 items-center px-1">
              {/* Daily Hours Tag on top of bar */}
              <Text
                className={`text-[10px] font-semibold font-sans mb-1.5 ${
                  hasHours
                    ? isHighlight
                      ? 'text-primary-600'
                      : 'text-neutral-700 dark:text-neutral-300'
                    : 'text-neutral-300'
                }`}
                numberOfLines={1}
              >
                {day.minutes > 0 ? `${(day.minutes / 60).toFixed(1)}h` : '0h'}
              </Text>

              {/* Bar Track & Fill */}
              <View className="w-full max-w-[28px] h-20 bg-neutral-100 dark:bg-neutral-800 rounded-t-lg justify-end overflow-hidden">
                <View
                  style={{ height: `${barHeightPct}%` }}
                  className={`w-full rounded-t-lg ${
                    isHighlight ? 'bg-primary-600' : hasHours ? 'bg-primary-400' : 'bg-transparent'
                  }`}
                />
              </View>

              {/* Day Label */}
              <View className="mt-2 items-center">
                <Text
                  className={`text-xs font-sans ${
                    isHighlight
                      ? 'font-bold text-primary-600'
                      : day.isWorkingDay
                        ? 'font-medium text-neutral-700 dark:text-neutral-300'
                        : 'text-neutral-400'
                  }`}
                >
                  {day.dayLabel}
                </Text>
                {isHighlight ? (
                  <View className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-0.5" />
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default WeeklyHoursCard;
