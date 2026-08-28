/**
 * iLogMo - Monthly Progress Analytics Card
 * Displays monthly totals, navigation between months, and weekly breakdown bars.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, Clock, Award } from 'lucide-react-native';
import { MonthlyAnalyticsStats } from '../types';
import { colors } from '@/constants/colors';

export interface MonthlyProgressCardProps {
  monthly: MonthlyAnalyticsStats;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthlyProgressCard({
  monthly,
  onPrevMonth,
  onNextMonth,
}: MonthlyProgressCardProps) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800 mb-4">
      {/* Month Navigator Header */}
      <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/40 items-center justify-center mr-2.5 border border-primary-100 dark:border-primary-800/50">
            <Calendar size={16} color={colors.primary[600]} />
          </View>
          <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">
            {monthly.monthFormatted}
          </Text>
        </View>

        {/* Previous / Next Month Controls */}
        <View className="flex-row items-center space-x-1">
          <TouchableOpacity
            onPress={onPrevMonth}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 items-center justify-center border border-neutral-200 dark:border-neutral-800"
          >
            <ChevronLeft size={16} color={colors.neutral[700]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNextMonth}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Next month"
            className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 items-center justify-center border border-neutral-200 dark:border-neutral-800 ml-1.5"
          >
            <ChevronRight size={16} color={colors.neutral[700]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Monthly Highlight Stats Banner */}
      <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 mb-4">
        {/* Total Month Hours */}
        <View className="flex-1">
          <View className="flex-row items-center mb-0.5">
            <Clock size={13} color={colors.neutral[400]} />
            <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Hours
            </Text>
          </View>
          <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
            {monthly.totalHoursFormatted}
          </Text>
        </View>

        <View className="h-8 w-[1px] bg-neutral-200 mx-2" />

        {/* Monthly Attendance Rate */}
        <View className="flex-1 pl-2">
          <View className="flex-row items-center mb-0.5">
            <Award size={13} color={colors.neutral[400]} />
            <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Month Rate
            </Text>
          </View>
          <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
            {monthly.attendanceRateFormatted}
          </Text>
        </View>
      </View>

      {/* Weekly Breakdown Section */}
      <View>
        <Text className="text-xs font-bold font-sans text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5">
          Weekly Breakdown
        </Text>

        {monthly.weeks.length === 0 ? (
          <Text className="text-xs font-sans text-neutral-400 py-2">
            No attendance recorded for this month.
          </Text>
        ) : (
          <View className="space-y-2.5">
            {monthly.weeks.map((week) => {
              return (
                <View key={week.weekLabel} className="mb-2">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs font-semibold font-sans text-neutral-700 dark:text-neutral-300">
                      {week.weekLabel}
                    </Text>
                    <Text className="text-xs font-bold font-sans text-neutral-900 dark:text-neutral-100">
                      {week.totalHoursFormatted}
                    </Text>
                  </View>

                  {/* Horizontal Bar */}
                  <View className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <View
                      style={{ width: `${Math.max(4, week.percentageOfMax)}%` }}
                      className={`h-full rounded-full ${
                        week.totalMinutes > 0 ? 'bg-primary-600' : 'bg-transparent'
                      }`}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

export default MonthlyProgressCard;
