import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { WeeklyAttendanceStats } from '../types';
import { colors } from '@/constants/colors';

export interface WeeklyOverviewCardProps {
  stats: WeeklyAttendanceStats;
}

export function WeeklyOverviewCard({ stats }: WeeklyOverviewCardProps) {
  const router = useRouter();

  return (
    <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-5">
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-bold font-sans text-neutral-900">This Week Overview</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/calendar')}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="flex-row items-center"
        >
          <Calendar size={14} color={colors.primary[600]} />
          <Text className="text-xs font-semibold font-sans text-primary-600 ml-1">
            View Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4 Statistics Columns Grid */}
      <View className="flex-row justify-between items-center bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
        {/* Total Hours */}
        <View className="items-center flex-1">
          <Text className="text-sm font-bold font-sans text-neutral-900" numberOfLines={1}>
            {stats.totalHoursFormatted}
          </Text>
          <Text className="text-[11px] font-sans text-neutral-500 mt-0.5">Hours</Text>
        </View>

        <View className="w-px h-7 bg-neutral-200" />

        {/* Days Present */}
        <View className="items-center flex-1">
          <Text className="text-sm font-bold font-sans text-neutral-900">{stats.daysPresent}</Text>
          <Text className="text-[11px] font-sans text-neutral-500 mt-0.5">Days</Text>
        </View>

        <View className="w-px h-7 bg-neutral-200" />

        {/* Late Hours */}
        <View className="items-center flex-1">
          <Text className="text-sm font-bold font-sans text-amber-600" numberOfLines={1}>
            {stats.lateHoursFormatted}
          </Text>
          <Text className="text-[11px] font-sans text-neutral-500 mt-0.5">Late</Text>
        </View>

        <View className="w-px h-7 bg-neutral-200" />

        {/* Attendance Rate */}
        <View className="items-center flex-1">
          <Text className="text-sm font-bold font-sans text-emerald-600">
            {stats.attendanceRate}%
          </Text>
          <Text className="text-[11px] font-sans text-neutral-500 mt-0.5">Attend.</Text>
        </View>
      </View>
    </View>
  );
}

export default WeeklyOverviewCard;
