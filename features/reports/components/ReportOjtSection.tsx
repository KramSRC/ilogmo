/**
 * iLogMo - ReportOjtSection Component
 * Formal summary card for Host Company, Position, Dates, and OJT setup details.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, ChevronRight } from 'lucide-react-native';
import { ReportOjtSummary, ReportHoursSummary } from '../types';
import { colors } from '@/constants/colors';

export interface ReportOjtSectionProps {
  ojt: ReportOjtSummary | null;
  hours: ReportHoursSummary;
}

export function ReportOjtSection({ ojt, hours }: ReportOjtSectionProps) {
  const router = useRouter();

  if (!ojt) {
    return (
      <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-4">
        <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-2">OJT Summary</Text>
        <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mb-3">
          No active OJT setup found. Please configure your internship details to view full progress.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(onboarding)/ojt-setup')}
          activeOpacity={0.75}
          style={{ minHeight: 44 }}
          className="bg-primary-50 dark:bg-primary-900/40 border border-primary-200 rounded-xl px-4 py-2.5 items-center justify-center"
        >
          <Text className="text-xs font-bold font-sans text-primary-700 dark:text-primary-300">Set Up OJT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const workingDaysFormatted = ojt.workingDays?.join(', ') || 'Monday – Friday';

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800/50 items-center justify-center mr-2.5">
            <Building2 size={16} color={colors.primary[600]} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">OJT Summary</Text>
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Host Training Establishment</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(app)/edit-ojt')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="View OJT details"
          style={{ minHeight: 44 }}
          className="flex-row items-center justify-center px-2 py-1 -mr-2"
        >
          <Text className="text-xs font-bold font-sans text-primary-600 mr-0.5">Details</Text>
          <ChevronRight size={14} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Grid of details */}
      <View className="space-y-2">
        {/* Company */}
        <View className="flex-row justify-between items-start py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Company</Text>
          <Text className="text-xs font-bold font-sans text-neutral-900 dark:text-neutral-100 text-right flex-1 ml-4" numberOfLines={2}>
            {ojt.companyName}
          </Text>
        </View>

        {/* Position / Dept */}
        <View className="flex-row justify-between items-start py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Department / Role</Text>
          <Text className="text-xs font-semibold font-sans text-neutral-800 dark:text-neutral-200 text-right flex-1 ml-4" numberOfLines={2}>
            {ojt.department}
          </Text>
        </View>

        {/* Supervisor */}
        {ojt.supervisorName ? (
          <View className="flex-row justify-between items-start py-1">
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Supervisor</Text>
            <Text className="text-xs font-medium font-sans text-neutral-800 dark:text-neutral-200 text-right flex-1 ml-4">
              {ojt.supervisorName}
            </Text>
          </View>
        ) : null}

        {/* Required Hours */}
        <View className="flex-row justify-between items-center py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Required Hours</Text>
          <Text className="text-xs font-bold font-sans text-neutral-900 dark:text-neutral-100">{hours.requiredHours} hours</Text>
        </View>

        {/* Completed */}
        <View className="flex-row justify-between items-center py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Completed Hours</Text>
          <Text className="text-xs font-semibold font-sans text-emerald-700 dark:text-emerald-300">{hours.completedHoursFormatted}</Text>
        </View>

        {/* Remaining */}
        <View className="flex-row justify-between items-center py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Remaining Hours</Text>
          <Text className="text-xs font-semibold font-sans text-neutral-800 dark:text-neutral-200">{hours.remainingHoursFormatted}</Text>
        </View>

        {/* Progress */}
        <View className="flex-row justify-between items-center py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Progress</Text>
          <Text className="text-xs font-bold font-sans text-primary-700 dark:text-primary-300">{hours.progressPercentage}%</Text>
        </View>

        {/* Start Date */}
        <View className="flex-row justify-between items-center py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Start Date</Text>
          <Text className="text-xs font-medium font-sans text-neutral-800 dark:text-neutral-200">{ojt.startDateFormatted}</Text>
        </View>

        {/* Expected End Date */}
        <View className="flex-row justify-between items-center py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Expected End Date</Text>
          <Text className="text-xs font-medium font-sans text-neutral-800 dark:text-neutral-200">
            {ojt.expectedEndDateFormatted || 'Flexible'}
          </Text>
        </View>

        {/* Working Days */}
        <View className="flex-row justify-between items-start py-1">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Scheduled Days</Text>
          <Text className="text-xs font-medium font-sans text-neutral-800 dark:text-neutral-200 text-right flex-1 ml-4" numberOfLines={2}>
            {workingDaysFormatted}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default ReportOjtSection;
