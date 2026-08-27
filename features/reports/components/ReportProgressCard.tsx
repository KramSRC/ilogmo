/**
 * iLogMo - ReportProgressCard Component
 * Prominent formal progress card with visual completion bar and hours breakdown.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Award, Clock, Sparkles } from 'lucide-react-native';
import { ReportHoursSummary } from '../types';
import { colors } from '@/constants/colors';

export interface ReportProgressCardProps {
  hours: ReportHoursSummary;
  dateRangeDisplay: string;
}

export function ReportProgressCard({ hours, dateRangeDisplay }: ReportProgressCardProps) {
  const isCompleted = hours.progressPercentage >= 100;

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`OJT progress: ${hours.progressPercentage} percent, ${hours.completedHoursFormatted} of ${hours.requiredHours} hours completed. ${hours.remainingHoursFormatted} remaining.`}
      className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-4"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-base font-bold font-sans text-neutral-900 tracking-tight">
            OJT Progress
          </Text>
          <Text className="text-xs font-sans text-neutral-500 mt-0.5">{dateRangeDisplay}</Text>
        </View>

        <View
          style={[
            { paddingHorizontal: 10, paddingVertical: 4 },
            isCompleted ? { backgroundColor: '#ECFDF5' } : { backgroundColor: '#EFF6FF' },
          ]}
          className="rounded-full border border-neutral-200 flex-row items-center"
        >
          {isCompleted ? (
            <Sparkles size={12} color={colors.success.DEFAULT} />
          ) : (
            <Award size={12} color={colors.primary[600]} />
          )}
          <Text
            className={`text-xs font-bold font-sans ml-1.5 ${
              isCompleted ? 'text-emerald-700' : 'text-primary-700'
            }`}
          >
            {hours.progressPercentage}%
          </Text>
        </View>
      </View>

      {/* Primary Numbers */}
      <View className="flex-row items-baseline justify-between mb-2">
        <View className="flex-row items-baseline">
          <Text className="text-2xl font-bold font-sans text-neutral-900">
            {hours.completedHoursFormatted}
          </Text>
          <Text className="text-sm font-sans text-neutral-500 ml-1.5">
            / {hours.requiredHours}h required
          </Text>
        </View>

        <Text className="text-xs font-semibold font-sans text-neutral-600">
          {hours.remainingHoursFormatted} left
        </Text>
      </View>

      {/* Visual Progress Bar */}
      <View className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden mb-3">
        <View
          style={{ width: `${Math.min(100, Math.max(0, hours.progressPercentage))}%` }}
          className={`h-full rounded-full ${
            isCompleted ? 'bg-emerald-500' : 'bg-primary-600'
          }`}
        />
      </View>

      {/* Bottom Mini Breakdown */}
      <View className="flex-row items-center justify-between pt-2.5 border-t border-neutral-100">
        <View className="flex-row items-center">
          <Clock size={13} color={colors.neutral[400]} />
          <Text className="text-[11px] font-sans text-neutral-500 ml-1.5">
            Completed:{' '}
            <Text className="font-semibold text-neutral-800">
              {hours.completedHoursDecimal} hrs
            </Text>
          </Text>
        </View>

        <Text className="text-[11px] font-sans text-neutral-500">
          Remaining:{' '}
          <Text className="font-semibold text-neutral-800">
            {hours.remainingHoursDecimal} hrs
          </Text>
        </Text>
      </View>
    </View>
  );
}

export default ReportProgressCard;
