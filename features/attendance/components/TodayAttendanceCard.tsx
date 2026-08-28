import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { PlayCircle, LogOut, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { AttendanceRecord } from '../types';
import { Button } from '@/components';
import { formatDateDisplay, formatTimeDisplay, isWeekendDay } from '../utils/timeUtils';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

export interface TodayAttendanceCardProps {
  todayRecord: AttendanceRecord | null;
  workingDuration: string;
  onPressCheckIn: () => void;
  onPressCheckOut: () => void;
  isSubmitting?: boolean;
}

export function TodayAttendanceCard({
  todayRecord,
  workingDuration,
  onPressCheckIn,
  onPressCheckOut,
  isSubmitting = false,
}: TodayAttendanceCardProps) {
  const router = useRouter();
  const isDark = useThemeStore((state) => state.isDark);
  const today = new Date();
  const todayFormatted = `Today • ${formatDateDisplay(today)}`;
  const isWeekend = isWeekendDay(today);

  // Determine state
  const isWorking = todayRecord?.status === 'working';
  const isCompleted = todayRecord?.status === 'completed';
  const isNotCheckedIn = !todayRecord;

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-5">
      {/* Top Date & Working Day Status Row */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xs font-semibold font-sans text-neutral-500 dark:text-neutral-400">{todayFormatted}</Text>
        <View
          className={`px-2.5 py-0.5 rounded-full border ${
            isWeekend ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-transparent' : 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800'
          }`}
        >
          <Text
            className={`text-[11px] font-semibold font-sans ${
              isWeekend ? 'text-neutral-600 dark:text-neutral-400' : 'text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {isWeekend ? 'Day Off' : 'Working Day'}
          </Text>
        </View>
      </View>

      {/* Check In / Check Out Timestamps Box */}
      <View className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 mb-4">
        <View className="flex-row items-center justify-between">
          {/* Check In Column */}
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <View
                className={`w-4 h-4 rounded-full items-center justify-center mr-1.5 ${
                  todayRecord ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              >
                {todayRecord ? (
                  <CheckCircle2 size={12} color="#FFFFFF" />
                ) : (
                  <View className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-900" />
                )}
              </View>
              <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Check In</Text>
            </View>
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 ml-5">
              {todayRecord ? formatTimeDisplay(todayRecord.checkIn) : '--:--'}
            </Text>
          </View>

          {/* Divider */}
          <View className="w-px h-10 bg-neutral-200 mx-2" />

          {/* Check Out Column */}
          <View className="flex-1 items-end">
            <View className="flex-row items-center mb-1">
              <View
                className={`w-4 h-4 rounded-full items-center justify-center mr-1.5 ${
                  isCompleted ? 'bg-blue-500 dark:bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={12} color="#FFFFFF" />
                ) : (
                  <View className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-900" />
                )}
              </View>
              <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Check Out</Text>
            </View>
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mr-5">
              {isCompleted && todayRecord?.checkOut
                ? formatTimeDisplay(todayRecord.checkOut)
                : '--:--'}
            </Text>
          </View>
        </View>
      </View>

      {/* Working Duration Display (Centered Big Stat) */}
      <View className="items-center py-2 mb-4">
        <Text className="text-4xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
          {workingDuration}
        </Text>
        <Text className="text-xs font-semibold font-sans text-neutral-400 mt-1 uppercase tracking-wider">
          {isCompleted ? 'Total Hours Completed' : 'Hours Today'}
        </Text>
      </View>

      {/* Action Button depending on state */}
      {isNotCheckedIn ? (
        <Button
          title="Check In"
          onPress={onPressCheckIn}
          isLoading={isSubmitting}
          variant="primary"
          size="md"
          leftIcon={<PlayCircle size={18} color="#FFFFFF" />}
          className="w-full"
        />
      ) : isWorking ? (
        <Button
          title="Check Out"
          onPress={onPressCheckOut}
          isLoading={isSubmitting}
          variant="primary"
          size="md"
          leftIcon={<LogOut size={18} color="#FFFFFF" />}
          className="w-full"
        />
      ) : (
        <Button
          title="View Details"
          onPress={() => {
            if (todayRecord?.id) {
              router.push(`/(app)/attendance-details?id=${todayRecord.id}` as any);
            }
          }}
          variant="outline"
          size="md"
          rightIcon={<ArrowRight size={16} color={isDark ? colors.neutral[300] : colors.neutral[700]} />}
          className="w-full"
        />
      )}
    </View>
  );
}

export default TodayAttendanceCard;
