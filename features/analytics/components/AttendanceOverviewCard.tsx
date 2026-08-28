/**
 * iLogMo - Attendance Overview Card
 * Displays attendance breakdown (Present, Late, Absent, Day Off), attendance rate, and average daily hours.
 */

import React from 'react';
import { View, Text } from 'react-native';
import {
  UserCheck,
  Clock,
  CalendarDays,
  CheckCircle,
  AlertCircle,
  XCircle,
  Coffee,
} from 'lucide-react-native';
import { AttendanceOverviewStats } from '../types';
import { colors } from '@/constants/colors';

export interface AttendanceOverviewCardProps {
  overview: AttendanceOverviewStats;
}

export function AttendanceOverviewCard({ overview }: AttendanceOverviewCardProps) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 items-center justify-center mr-2.5 border border-emerald-100">
            <UserCheck size={16} color={colors.success.DEFAULT} />
          </View>
          <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">
            Attendance Overview
          </Text>
        </View>

        {/* Attendance Rate Badge */}
        <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-transparent">
          <Text className="text-xs font-sans text-neutral-600 dark:text-neutral-400 mr-1">Rate:</Text>
          <Text className="text-xs font-bold font-sans text-neutral-900 dark:text-neutral-100">
            {overview.attendanceRateFormatted}
          </Text>
        </View>
      </View>

      {/* 2x2 Grid of Statuses */}
      <View className="flex-row mb-3">
        {/* Present */}
        <View className="flex-1 bg-emerald-50 dark:bg-emerald-900/40/60 rounded-2xl p-3.5 mr-2 border border-emerald-100/80">
          <View className="flex-row items-center mb-1">
            <CheckCircle size={14} color={colors.success.DEFAULT} />
            <Text className="ml-1.5 text-xs font-bold font-sans text-emerald-900 dark:text-emerald-100">Present</Text>
          </View>
          <Text className="text-lg font-bold font-sans text-emerald-950">
            {overview.presentDays}{' '}
            <Text className="text-xs font-normal text-emerald-700 dark:text-emerald-300">days</Text>
          </Text>
        </View>

        {/* Late */}
        <View className="flex-1 bg-amber-50 dark:bg-amber-900/40/60 rounded-2xl p-3.5 ml-2 border border-amber-100/80">
          <View className="flex-row items-center mb-1">
            <AlertCircle size={14} color={colors.warning.DEFAULT} />
            <Text className="ml-1.5 text-xs font-bold font-sans text-amber-900 dark:text-amber-100">Late</Text>
          </View>
          <Text className="text-lg font-bold font-sans text-amber-950">
            {overview.lateDays} <Text className="text-xs font-normal text-amber-700">days</Text>
          </Text>
        </View>
      </View>

      <View className="flex-row mb-4">
        {/* Absent */}
        <View className="flex-1 bg-red-50 dark:bg-red-900/40/60 rounded-2xl p-3.5 mr-2 border border-red-100/80">
          <View className="flex-row items-center mb-1">
            <XCircle size={14} color={colors.error.DEFAULT} />
            <Text className="ml-1.5 text-xs font-bold font-sans text-red-900 dark:text-red-100">Absent</Text>
          </View>
          <Text className="text-lg font-bold font-sans text-red-950">
            {overview.absentDays} <Text className="text-xs font-normal text-red-700 dark:text-red-300">days</Text>
          </Text>
        </View>

        {/* Day Off */}
        <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-3.5 ml-2 border border-neutral-200 dark:border-transparent">
          <View className="flex-row items-center mb-1">
            <Coffee size={14} color={colors.neutral[500]} />
            <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-700 dark:text-neutral-300">Day Off</Text>
          </View>
          <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100">
            {overview.dayOffDays} <Text className="text-xs font-normal text-neutral-500 dark:text-neutral-400">days</Text>
          </Text>
        </View>
      </View>

      {/* Footer Metrics (Days Attended & Average Hours) */}
      <View className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <CalendarDays size={14} color={colors.neutral[400]} />
          <View className="ml-2">
            <Text className="text-xs font-sans text-neutral-400">Days Attended</Text>
            <Text className="text-xs font-bold font-sans text-neutral-800 dark:text-neutral-200">
              {overview.totalAttendedDays} {overview.totalAttendedDays === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>

        <View className="h-6 w-[1px] bg-neutral-200 mx-2" />

        <View className="flex-1 flex-row items-center pl-2">
          <Clock size={14} color={colors.neutral[400]} />
          <View className="ml-2">
            <Text className="text-xs font-sans text-neutral-400">Avg Hours / Day</Text>
            <Text className="text-xs font-bold font-sans text-neutral-800 dark:text-neutral-200">
              {overview.averageHoursFormatted}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default AttendanceOverviewCard;
