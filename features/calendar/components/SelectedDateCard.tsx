import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronRight,
  Coffee,
  Info,
  Timer,
} from 'lucide-react-native';
import { SelectedDateDetails, CalendarDayStatus } from '../types/calendar.types';
import { colors } from '@/constants/colors';

export interface SelectedDateCardProps {
  details: SelectedDateDetails | null;
}

/**
 * Status Badge for Calendar Selected Date view
 */
function CalendarStatusBadge({ status }: { status: CalendarDayStatus }) {
  let bg = 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800';
  let textColor = 'text-neutral-700 dark:text-neutral-300';
  let label = 'No Record';
  let icon = <Info size={12} color={colors.neutral[500]} />;

  switch (status) {
    case 'completed':
    case 'present':
      bg = 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800';
      textColor = 'text-emerald-700 dark:text-emerald-300';
      label = status === 'completed' ? 'Completed' : 'Present';
      icon = <CheckCircle2 size={12} color={colors.success.DEFAULT} strokeWidth={2.5} />;
      break;
    case 'working':
      bg = 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800';
      textColor = 'text-blue-700 dark:text-blue-300';
      label = 'Working';
      icon = <View className="w-2 h-2 rounded-full bg-blue-50 dark:bg-blue-900/400 mr-1" />;
      break;
    case 'late':
      bg = 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800';
      textColor = 'text-amber-700';
      label = 'Late';
      icon = <Clock size={12} color={colors.warning.DEFAULT} />;
      break;
    case 'absent':
      bg = 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800';
      textColor = 'text-red-700 dark:text-red-300';
      label = 'Absent';
      icon = <AlertCircle size={12} color={colors.error.DEFAULT} />;
      break;
    case 'day_off':
      bg = 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800';
      textColor = 'text-neutral-600 dark:text-neutral-400';
      label = 'Day Off';
      icon = <CalendarIcon size={12} color={colors.neutral[500]} />;
      break;
    case 'upcoming':
      bg = 'bg-primary-50 dark:bg-primary-900/40 border-primary-200';
      textColor = 'text-primary-700 dark:text-primary-300';
      label = 'Upcoming';
      icon = <CalendarIcon size={12} color={colors.primary[600]} />;
      break;
    case 'before_ojt':
      bg = 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800';
      textColor = 'text-neutral-500 dark:text-neutral-400';
      label = 'Before OJT';
      icon = <Info size={12} color={colors.neutral[400]} />;
      break;
    case 'after_ojt':
      bg = 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800';
      textColor = 'text-neutral-500 dark:text-neutral-400';
      label = 'After OJT';
      icon = <Info size={12} color={colors.neutral[400]} />;
      break;
  }

  return (
    <View className={`flex-row items-center px-3 py-1 rounded-full border ${bg}`}>
      <View className="mr-1.5">{icon}</View>
      <Text className={`text-xs font-semibold font-sans capitalize ${textColor}`}>{label}</Text>
    </View>
  );
}

export function SelectedDateCard({ details }: SelectedDateCardProps) {
  const router = useRouter();

  if (!details) {
    return (
      <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800 mb-5 items-center">
        <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400">
          Tap a date on the calendar to view its details.
        </Text>
      </View>
    );
  }

  const hasRecord = details.attendanceRecord !== null && details.attendanceRecord !== undefined;
  const isWorking = details.status === 'working';
  const isLate = details.status === 'late';

  const handleViewDetails = () => {
    if (details.attendanceRecord?.id) {
      router.push(`/(app)/attendance-details?id=${details.attendanceRecord.id}` as any);
    } else {
      router.push('/(app)/attendance');
    }
  };

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800 mb-5">
      {/* Section Header */}
      <View className="flex-row justify-between items-start pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-1 mr-2">
          <Text className="text-xs font-semibold font-sans text-primary-600 uppercase tracking-wider">
            {details.dayOfWeek}
          </Text>
          <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-0.5">
            {details.formattedDate}
          </Text>
        </View>
        <CalendarStatusBadge status={details.status} />
      </View>

      {/* Main Status & Time Stats */}
      {hasRecord ? (
        <View>
          {/* Big Total Worked Time Display */}
          <View className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 mb-4 border border-neutral-100 dark:border-neutral-800 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/40 items-center justify-center mr-3 border border-primary-100 dark:border-primary-800/50">
                <Timer size={20} color={colors.primary[600]} />
              </View>
              <View>
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">
                  {isWorking ? 'Current Duration' : 'Total Worked Time'}
                </Text>
                <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {details.totalHoursFormatted || '0h 00m'}
                </Text>
              </View>
            </View>

            {isWorking ? (
              <View className="px-2.5 py-1 bg-blue-100 rounded-lg">
                <Text className="text-[11px] font-bold font-sans text-blue-700 dark:text-blue-300">IN PROGRESS</Text>
              </View>
            ) : null}
          </View>

          {/* Time Breakdown Rows */}
          <View className="space-y-2.5 mb-4">
            {/* Check In */}
            <View className="flex-row justify-between items-center py-1">
              <View className="flex-row items-center">
                <Clock size={15} color={colors.neutral[400]} />
                <Text className="text-xs font-sans text-neutral-600 dark:text-neutral-400 ml-2">Check In</Text>
              </View>
              <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">
                {details.checkInFormatted || '--:--'}
              </Text>
            </View>

            {/* Check Out */}
            <View className="flex-row justify-between items-center py-1">
              <View className="flex-row items-center">
                <Clock size={15} color={colors.neutral[400]} />
                <Text className="text-xs font-sans text-neutral-600 dark:text-neutral-400 ml-2">Check Out</Text>
              </View>
              <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">
                {details.checkOutFormatted || (isWorking ? 'In progress' : '--:--')}
              </Text>
            </View>

            {/* Late Details if Late */}
            {isLate && details.expectedStartTime ? (
              <View className="flex-row justify-between items-center py-1">
                <View className="flex-row items-center">
                  <AlertCircle size={15} color={colors.warning.DEFAULT} />
                  <Text className="text-xs font-sans text-amber-700 ml-2">Expected Start</Text>
                </View>
                <Text className="text-sm font-bold font-sans text-amber-700">
                  {details.expectedStartTime}
                </Text>
              </View>
            ) : null}

            {/* Break Time */}
            {details.breakTimeFormatted && details.breakTimeFormatted !== '0h 00m' ? (
              <View className="flex-row justify-between items-center py-1">
                <View className="flex-row items-center">
                  <Coffee size={15} color={colors.neutral[400]} />
                  <Text className="text-xs font-sans text-neutral-600 dark:text-neutral-400 ml-2">Break Time</Text>
                </View>
                <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">
                  {details.breakTimeFormatted}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleViewDetails}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="View full attendance details for this date"
            className="w-full flex-row items-center justify-center bg-neutral-900 py-3 rounded-xl min-h-[44px]"
          >
            <Text className="text-xs font-bold font-sans text-white mr-1.5">View Details</Text>
            <ChevronRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : (
        /* Empty / Absent / Day Off / Upcoming States */
        <View className="py-2">
          <Text className="text-sm font-sans text-neutral-600 dark:text-neutral-400 leading-5 mb-3">
            {details.statusDescription}
          </Text>

          {details.isToday && details.status === 'upcoming' ? (
            <TouchableOpacity
              onPress={() => router.push('/(app)/attendance')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go to Attendance screen to check in"
              className="w-full flex-row items-center justify-center bg-primary-600 py-3 rounded-xl min-h-[44px]"
            >
              <Text className="text-xs font-bold font-sans text-white mr-1.5">
                Go to Attendance Check-In
              </Text>
              <ChevronRight size={14} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
}

export default SelectedDateCard;
