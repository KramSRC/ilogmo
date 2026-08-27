import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, CheckCircle2, PlayCircle, ArrowRight } from 'lucide-react-native';
import { TodayAttendance } from '../types';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

export interface AttendanceSummaryCardProps {
  attendance: TodayAttendance;
}

export function AttendanceSummaryCard({ attendance }: AttendanceSummaryCardProps) {
  const router = useRouter();

  const handleAction = () => {
    router.push('/(app)/attendance');
  };

  // State B: Currently Working
  if (attendance.state === 'working') {
    return (
      <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-emerald-50 items-center justify-center mr-2.5 border border-emerald-100">
              <Clock size={16} color={colors.success.DEFAULT} />
            </View>
            <Text className="text-base font-bold font-sans text-neutral-900">
              Today's Attendance
            </Text>
          </View>
          <View className="bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
            <Text className="text-xs font-semibold font-sans text-emerald-700">Working</Text>
          </View>
        </View>

        <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xs font-sans text-neutral-500">Checked in at</Text>
              <Text className="text-lg font-bold font-sans text-neutral-900 mt-0.5">
                {attendance.checkInTime || '8:01 AM'}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-sans text-neutral-500">Working duration</Text>
              <Text className="text-lg font-bold font-sans text-emerald-600 mt-0.5">
                {attendance.workingDuration || '3h 42m'}
              </Text>
            </View>
          </View>
        </View>

        <Button
          title="Check Out"
          onPress={handleAction}
          variant="primary"
          size="md"
          className="w-full"
        />
      </View>
    );
  }

  // State C: Completed
  if (attendance.state === 'completed') {
    return (
      <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-blue-50 items-center justify-center mr-2.5 border border-blue-100">
              <CheckCircle2 size={16} color={colors.primary[600]} />
            </View>
            <Text className="text-base font-bold font-sans text-neutral-900">
              Today's Attendance
            </Text>
          </View>
          <View className="bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <Text className="text-xs font-semibold font-sans text-primary-700">Completed</Text>
          </View>
        </View>

        <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xs font-sans text-neutral-500">Hours Recorded</Text>
              <Text className="text-sm font-semibold font-sans text-neutral-800 mt-0.5">
                {attendance.checkInTime || '8:01 AM'} — {attendance.checkOutTime || '5:02 PM'}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-sans text-neutral-500">Total Hours</Text>
              <Text className="text-base font-bold font-sans text-primary-700 mt-0.5">
                {attendance.totalHours || '8h 57m'}
              </Text>
            </View>
          </View>
          <Text className="text-xs font-sans text-neutral-500 mt-2">Today's OJT completed</Text>
        </View>

        <Button
          title="View Details"
          onPress={handleAction}
          variant="outline"
          size="md"
          rightIcon={<ArrowRight size={16} color={colors.neutral[700]} />}
          className="w-full"
        />
      </View>
    );
  }

  // State A: Not checked in (Default)
  return (
    <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-5">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-amber-50 items-center justify-center mr-2.5 border border-amber-100">
            <Clock size={16} color={colors.warning.DEFAULT} />
          </View>
          <Text className="text-base font-bold font-sans text-neutral-900">Today's Attendance</Text>
        </View>
        <View className="bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <Text className="text-xs font-semibold font-sans text-amber-700">Not checked in</Text>
        </View>
      </View>

      <Text className="text-sm font-sans text-neutral-500 mb-4">
        Start your OJT day by checking in.
      </Text>

      <Button
        title="Check In"
        onPress={handleAction}
        variant="primary"
        size="md"
        leftIcon={<PlayCircle size={18} color="#FFFFFF" />}
        className="w-full"
      />
    </View>
  );
}

export default AttendanceSummaryCard;
