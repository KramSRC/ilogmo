import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, CalendarOff } from 'lucide-react-native';
import { AttendanceRecord } from '../types';
import { AttendanceHistoryItem } from './AttendanceHistoryItem';
import { colors } from '@/constants/colors';

export interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

export function AttendanceHistory({ records }: AttendanceHistoryProps) {
  const router = useRouter();

  return (
    <View className="mb-6">
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Attendance History</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/attendance-history')}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="flex-row items-center"
        >
          <Text className="text-xs font-semibold font-sans text-primary-600 mr-0.5">See All</Text>
          <ChevronRight size={14} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* History Card Container */}
      <View className="bg-white dark:bg-neutral-900 rounded-card px-4 py-2 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent">
        {records.length === 0 ? (
          <View className="items-center py-6">
            <View className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-2">
              <CalendarOff size={20} color={colors.neutral[400]} />
            </View>
            <Text className="text-sm font-semibold font-sans text-neutral-700 dark:text-neutral-300">
              No attendance records yet
            </Text>
            <Text className="text-xs font-sans text-neutral-400 mt-0.5 text-center">
              Your attendance history will appear here after your first OJT day.
            </Text>
          </View>
        ) : (
          records.map((record, index) => (
            <AttendanceHistoryItem
              key={record.id}
              record={record}
              isLast={index === records.length - 1}
            />
          ))
        )}
      </View>
    </View>
  );
}

export default AttendanceHistory;
