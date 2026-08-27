import React from 'react';
import { View, Text } from 'react-native';
import { Clock, Percent, Award } from 'lucide-react-native';
import { MonthlyAttendanceSummary } from '../types/calendar.types';
import { colors } from '@/constants/colors';

export interface MonthlySummaryCardProps {
  summary: MonthlyAttendanceSummary;
}

export function MonthlySummaryCard({ summary }: MonthlySummaryCardProps) {
  return (
    <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 mb-4 border-b border-neutral-100">
        <Text className="text-base font-bold font-sans text-neutral-900">Monthly Summary</Text>
      </View>

      {/* 2-Column Metrics Cards: Total Hours & Attendance Rate */}
      <View className="flex-row justify-between mb-5">
        {/* Total Hours in Month */}
        <View className="flex-1 mr-2 bg-primary-50 rounded-2xl p-4 border border-primary-100">
          <View className="flex-row items-center mb-1.5">
            <Clock size={16} color={colors.primary[600]} />
            <Text className="text-xs font-semibold font-sans text-primary-700 ml-1.5">
              Total Hours
            </Text>
          </View>
          <Text className="text-xl font-bold font-sans text-neutral-900">
            {summary.totalWorkedHoursFormatted}
          </Text>
          <Text className="text-[11px] font-sans text-primary-600/80 mt-0.5">
            Worked this month
          </Text>
        </View>

        {/* Monthly Attendance Rate */}
        <View className="flex-1 ml-2 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <View className="flex-row items-center mb-1.5">
            <Percent size={16} color={colors.success.DEFAULT} />
            <Text className="text-xs font-semibold font-sans text-emerald-700 ml-1.5">
              Attendance
            </Text>
          </View>
          <Text className="text-xl font-bold font-sans text-neutral-900">
            {summary.attendanceRateFormatted}
          </Text>
          <Text className="text-[11px] font-sans text-emerald-600/80 mt-0.5">
            {summary.attendanceRate !== null ? 'On-time & present' : 'No past shifts'}
          </Text>
        </View>
      </View>

      {/* Days Breakdown Table */}
      <View className="space-y-3 pt-1 border-t border-neutral-100">
        {/* Present Days */}
        <View className="flex-row justify-between items-center py-1">
          <View className="flex-row items-center">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.success.DEFAULT,
                marginRight: 10,
              }}
            />
            <Text className="text-xs font-sans text-neutral-700">Present</Text>
          </View>
          <Text className="text-xs font-bold font-sans text-neutral-900">
            {summary.presentCount} {summary.presentCount === 1 ? 'day' : 'days'}
          </Text>
        </View>

        {/* Late Days */}
        <View className="flex-row justify-between items-center py-1">
          <View className="flex-row items-center">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.warning.DEFAULT,
                marginRight: 10,
              }}
            />
            <Text className="text-xs font-sans text-neutral-700">Late</Text>
          </View>
          <Text className="text-xs font-bold font-sans text-neutral-900">
            {summary.lateCount} {summary.lateCount === 1 ? 'day' : 'days'}
          </Text>
        </View>

        {/* Absent Days */}
        <View className="flex-row justify-between items-center py-1">
          <View className="flex-row items-center">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.error.DEFAULT,
                marginRight: 10,
              }}
            />
            <Text className="text-xs font-sans text-neutral-700">Absent</Text>
          </View>
          <Text className="text-xs font-bold font-sans text-neutral-900">
            {summary.absentCount} {summary.absentCount === 1 ? 'day' : 'days'}
          </Text>
        </View>

        {/* Day Off */}
        <View className="flex-row justify-between items-center py-1">
          <View className="flex-row items-center">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.neutral[300],
                marginRight: 10,
              }}
            />
            <Text className="text-xs font-sans text-neutral-700">Day Off</Text>
          </View>
          <Text className="text-xs font-bold font-sans text-neutral-900">
            {summary.dayOffCount} {summary.dayOffCount === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>

      {/* Overall OJT Hours Footer */}
      <View className="mt-4 pt-3 border-t border-neutral-100 flex-row justify-between items-center bg-neutral-50 rounded-xl px-3.5 py-2.5">
        <View className="flex-row items-center">
          <Award size={15} color={colors.primary[600]} />
          <Text className="text-xs font-medium font-sans text-neutral-600 ml-2">
            Overall OJT Progress
          </Text>
        </View>
        <Text className="text-xs font-bold font-sans text-neutral-900">
          {summary.completedOjtHours}h / {summary.requiredOjtHours}h
        </Text>
      </View>
    </View>
  );
}

export default MonthlySummaryCard;
