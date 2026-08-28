import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { AttendanceRecord } from '../types';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { formatDateShort, formatTimeDisplay, formatHoursMinutes } from '../utils/timeUtils';
import { colors } from '@/constants/colors';

export interface AttendanceHistoryItemProps {
  record: AttendanceRecord;
  isLast?: boolean;
}

export function AttendanceHistoryItem({ record, isLast = false }: AttendanceHistoryItemProps) {
  const router = useRouter();
  const { dayName, dayNumber } = formatDateShort(record.attendanceDate);

  const isWorking = record.status === 'working';
  const totalFormatted =
    record.totalMinutes !== undefined && record.totalMinutes !== null
      ? formatHoursMinutes(record.totalMinutes)
      : isWorking
        ? 'In progress'
        : '0h 00m';

  const handlePress = () => {
    router.push(`/(app)/attendance-details?id=${record.id}` as any);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Attendance on ${record.attendanceDate}, ${totalFormatted}, ${record.status}`}
      className={`flex-row items-center justify-between py-3.5 ${
        isLast ? '' : 'border-b border-neutral-100 dark:border-neutral-800'
      }`}
    >
      {/* Left Date Column */}
      <View className="flex-row items-center flex-1 mr-2">
        <View className="w-11 h-11 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-transparent items-center justify-center mr-3">
          <Text className="text-[10px] font-bold font-sans text-neutral-500 dark:text-neutral-400 uppercase">
            {dayName}
          </Text>
          <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100 -mt-0.5">{dayNumber}</Text>
        </View>

        {/* Timestamps & Hours */}
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-xs font-semibold font-sans text-neutral-800 dark:text-neutral-200">
              {formatTimeDisplay(record.checkIn)}
            </Text>
            <Text className="text-xs font-sans text-neutral-400 mx-1.5">—</Text>
            <Text className="text-xs font-semibold font-sans text-neutral-800 dark:text-neutral-200">
              {record.checkOut ? formatTimeDisplay(record.checkOut) : '--:--'}
            </Text>
          </View>

          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">
            Total: <Text className="font-semibold text-neutral-700 dark:text-neutral-300">{totalFormatted}</Text>
          </Text>
        </View>
      </View>

      {/* Right Status Badge & Chevron */}
      <View className="flex-row items-center">
        <AttendanceStatusBadge status={record.status} />
        <ChevronRight size={16} color={colors.neutral[400]} style={{ marginLeft: 6 }} />
      </View>
    </TouchableOpacity>
  );
}

export default AttendanceHistoryItem;
