import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, Calendar, Coffee, MapPin, FileText } from 'lucide-react-native';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AttendanceRecord } from '@/features/attendance/types';
import { attendanceService } from '@/features/attendance/services/attendanceService';
import { AttendanceStatusBadge } from '@/features/attendance/components/AttendanceStatusBadge';
import {
  formatDateDisplay,
  formatTimeDisplay,
  formatHoursMinutes,
} from '@/features/attendance/utils/timeUtils';
import { colors } from '@/constants/colors';

export default function AttendanceDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();

  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecord() {
      if (!user?.id || !id) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await attendanceService.getAttendanceById(user.id, id);
        setRecord(data);
      } catch (err) {
        console.warn('[AttendanceDetailsScreen] Error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRecord();
  }, [user?.id, id]);

  const totalFormatted =
    record?.totalMinutes !== undefined && record?.totalMinutes !== null
      ? formatHoursMinutes(record.totalMinutes)
      : record?.status === 'working'
        ? 'Currently Working'
        : '0h 00m';

  const breakFormatted = formatHoursMinutes(record?.breakMinutes ?? 0);

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-3 pb-3 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(app)/attendance');
            }
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{ minHeight: 44, minWidth: 44 }}
          className="rounded-full bg-white items-center justify-center border border-neutral-200 shadow-soft-sm mr-3"
        >
          <ArrowLeft size={20} color={colors.neutral[700]} />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-xl font-bold font-sans text-neutral-900">Attendance Details</Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      ) : !record ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-bold font-sans text-neutral-800">Record not found</Text>
          <Text className="text-xs font-sans text-neutral-500 mt-1 text-center">
            The requested attendance record could not be loaded.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          className="px-5 pt-2"
        >
          {/* Main Status & Date Summary Card */}
          <View className="bg-white rounded-card p-6 shadow-card border border-neutral-200 mb-4 items-center">
            <View className="w-14 h-14 bg-primary-50 rounded-2xl items-center justify-center mb-3 border border-primary-100">
              <Calendar size={26} color={colors.primary[600]} />
            </View>

            <Text className="text-lg font-bold font-sans text-neutral-900 text-center">
              {formatDateDisplay(record.attendanceDate)}
            </Text>

            <View className="mt-2">
              <AttendanceStatusBadge status={record.status} size="md" />
            </View>

            {/* Big Hours Count */}
            <View className="mt-5 items-center bg-neutral-50 rounded-2xl py-4 px-8 border border-neutral-100 w-full">
              <Text className="text-3xl font-bold font-sans text-neutral-900">
                {totalFormatted}
              </Text>
              <Text className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-wider mt-0.5">
                Total Worked Time
              </Text>
            </View>
          </View>

          {/* Time & Details Breakdown Card */}
          <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-4 space-y-4">
            <Text className="text-sm font-bold font-sans text-neutral-900 border-b border-neutral-100 pb-2">
              Time Breakdown
            </Text>

            {/* Check In */}
            <View className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center">
                <Clock size={16} color={colors.neutral[500]} />
                <Text className="ml-2.5 text-xs font-sans text-neutral-600">Check In</Text>
              </View>
              <Text className="text-sm font-bold font-sans text-neutral-900">
                {formatTimeDisplay(record.checkIn)}
              </Text>
            </View>

            {/* Check Out */}
            <View className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center">
                <Clock size={16} color={colors.neutral[500]} />
                <Text className="ml-2.5 text-xs font-sans text-neutral-600">Check Out</Text>
              </View>
              <Text className="text-sm font-bold font-sans text-neutral-900">
                {record.checkOut ? formatTimeDisplay(record.checkOut) : 'In progress'}
              </Text>
            </View>

            {/* Break Time */}
            <View className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center">
                <Coffee size={16} color={colors.neutral[500]} />
                <Text className="ml-2.5 text-xs font-sans text-neutral-600">Break Time</Text>
              </View>
              <Text className="text-sm font-bold font-sans text-neutral-900">{breakFormatted}</Text>
            </View>
          </View>

          {/* Location & Additional Info */}
          <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 space-y-3">
            <Text className="text-sm font-bold font-sans text-neutral-900 border-b border-neutral-100 pb-2">
              Additional Information
            </Text>

            {/* Location */}
            <View className="flex-row items-start py-1">
              <MapPin size={16} color={colors.neutral[500]} style={{ marginTop: 2 }} />
              <View className="ml-2.5 flex-1">
                <Text className="text-xs font-sans text-neutral-500">Location</Text>
                <Text className="text-xs font-semibold font-sans text-neutral-800 mt-0.5">
                  {record.latitude && record.longitude
                    ? `Lat: ${record.latitude.toFixed(4)}, Lng: ${record.longitude.toFixed(4)}`
                    : 'Not recorded'}
                </Text>
              </View>
            </View>

            {/* Notes */}
            <View className="flex-row items-start py-1">
              <FileText size={16} color={colors.neutral[500]} style={{ marginTop: 2 }} />
              <View className="ml-2.5 flex-1">
                <Text className="text-xs font-sans text-neutral-500">Notes</Text>
                <Text className="text-xs font-sans text-neutral-700 mt-0.5 leading-4">
                  {record.notes || 'No notes provided for this day.'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
