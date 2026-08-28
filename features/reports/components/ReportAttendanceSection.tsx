/**
 * iLogMo - ReportAttendanceSection Component
 * Formal summary card for Present, Absent, Missing Check-Outs, Total Hours, and Average daily pace.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, ChevronRight, AlertCircle } from 'lucide-react-native';
import { ReportAttendanceSummary } from '../types';
import { colors } from '@/constants/colors';

export interface ReportAttendanceSectionProps {
  attendance: ReportAttendanceSummary;
}

export function ReportAttendanceSection({ attendance }: ReportAttendanceSectionProps) {
  const router = useRouter();
  const hasAttendance = attendance.presentCount > 0 || attendance.totalWorkedMinutes > 0;

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 items-center justify-center mr-2.5">
            <Clock size={16} color={colors.success.DEFAULT} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Attendance Summary</Text>
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Rendered hours and daily pace</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(app)/attendance')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="View full attendance logs"
          style={{ minHeight: 44 }}
          className="flex-row items-center justify-center px-2 py-1 -mr-2"
        >
          <Text className="text-xs font-bold font-sans text-primary-600 mr-0.5">Logs</Text>
          <ChevronRight size={14} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {!hasAttendance ? (
        <View className="py-4 items-center justify-center">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 text-center">
            Attendance data will appear here once you start your OJT.
          </Text>
        </View>
      ) : (
        <>
          {/* Missing Check-Out Warning Banner if > 0 */}
          {attendance.missingCheckOutCount > 0 ? (
            <View className="mb-3.5 bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex-row items-center">
              <AlertCircle size={15} color="#D97706" />
              <Text className="text-xs font-sans text-amber-900 dark:text-amber-100 ml-2 flex-1">
                <Text className="font-bold">{attendance.missingCheckOutCount} past day(s)</Text> have missing check-out records.
              </Text>
            </View>
          ) : null}

          {/* 3x2 Metrics Grid */}
          <View className="flex-row flex-wrap justify-between -mx-1">
            {/* 1. Working Days */}
            <View className="w-1/3 px-1 mb-3">
              <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 items-center">
                <Text className="text-[10.5px] font-semibold font-sans text-neutral-500 dark:text-neutral-400 uppercase">
                  Working Days
                </Text>
                <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {attendance.workingDaysCount} / wk
                </Text>
              </View>
            </View>

            {/* 2. Present */}
            <View className="w-1/3 px-1 mb-3">
              <View className="bg-emerald-50 dark:bg-emerald-900/40/60 border border-emerald-100 rounded-xl p-2.5 items-center">
                <Text className="text-[10.5px] font-semibold font-sans text-emerald-800 uppercase">
                  Present
                </Text>
                <Text className="text-base font-bold font-sans text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {attendance.presentCount}
                </Text>
              </View>
            </View>

            {/* 3. Absent */}
            <View className="w-1/3 px-1 mb-3">
              <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 items-center">
                <Text className="text-[10.5px] font-semibold font-sans text-neutral-500 dark:text-neutral-400 uppercase">
                  Absent
                </Text>
                <Text className="text-base font-bold font-sans text-neutral-700 dark:text-neutral-300 mt-0.5">
                  {attendance.absentCount}
                </Text>
              </View>
            </View>

            {/* 4. Missing Check-Out */}
            <View className="w-1/3 px-1">
              <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 items-center">
                <Text className="text-[10px] font-semibold font-sans text-neutral-500 dark:text-neutral-400 uppercase text-center" numberOfLines={1}>
                  Missed Checkout
                </Text>
                <Text
                  className={`text-base font-bold font-sans mt-0.5 ${
                    attendance.missingCheckOutCount > 0 ? 'text-amber-600' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {attendance.missingCheckOutCount}
                </Text>
              </View>
            </View>

            {/* 5. Total Hours */}
            <View className="w-1/3 px-1">
              <View className="bg-primary-50 dark:bg-primary-900/40/60 border border-primary-100 dark:border-primary-800/50 rounded-xl p-2.5 items-center">
                <Text className="text-[10.5px] font-semibold font-sans text-primary-800 uppercase">
                  Total Hours
                </Text>
                <Text className="text-base font-bold font-sans text-primary-700 dark:text-primary-300 mt-0.5" numberOfLines={1}>
                  {attendance.totalWorkedHoursFormatted}
                </Text>
              </View>
            </View>

            {/* 6. Average Per Day */}
            <View className="w-1/3 px-1">
              <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 items-center">
                <Text className="text-[10.5px] font-semibold font-sans text-neutral-500 dark:text-neutral-400 uppercase">
                  Avg Daily
                </Text>
                <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-0.5" numberOfLines={1}>
                  {attendance.averageHoursFormatted}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ReportAttendanceSection;
