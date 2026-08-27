import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CalendarOff } from 'lucide-react-native';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AttendanceRecord } from '@/features/attendance/types';
import { attendanceService } from '@/features/attendance/services/attendanceService';
import { AttendanceHistoryItem } from '@/features/attendance/components/AttendanceHistoryItem';
import { ErrorMessage, Button } from '@/components';
import { colors } from '@/constants/colors';

export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await attendanceService.getAttendanceHistory(user.id, 100);
        if (isMounted) {
          setHistory(data);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[AttendanceHistoryScreen] Error:', err);
          setError('Unable to load full attendance history.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleRefresh = useCallback(async () => {
    if (!user?.id) return;
    setIsRefreshing(true);
    setError(null);

    try {
      const data = await attendanceService.getAttendanceHistory(user.id, 100);
      setHistory(data);
    } catch (err) {
      console.warn('[AttendanceHistoryScreen] Error:', err);
      setError('Unable to load full attendance history.');
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      {/* Top Header */}
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
          <Text className="text-xl font-bold font-sans text-neutral-900">Attendance History</Text>
          <Text className="text-xs font-sans text-neutral-500">
            Full record of your OJT attendance
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary[600]}
            colors={[colors.primary[600]]}
          />
        }
        className="px-5 pt-2"
      >
        {error ? (
          <View className="mb-4">
            <ErrorMessage message={error} type="error" />
            <Button
              title="Try Again"
              onPress={handleRefresh}
              variant="outline"
              size="sm"
              className="mt-2"
            />
          </View>
        ) : null}

        {/* History List Card */}
        <View className="bg-white rounded-card px-4 py-2 shadow-card border border-neutral-200">
          {history.length === 0 && !isLoading ? (
            <View className="items-center py-12">
              <View className="w-12 h-12 rounded-2xl bg-neutral-100 items-center justify-center mb-3">
                <CalendarOff size={24} color={colors.neutral[400]} />
              </View>
              <Text className="text-base font-bold font-sans text-neutral-800">
                No attendance records
              </Text>
              <Text className="text-xs font-sans text-neutral-400 mt-1 text-center">
                Your past attendance records will appear here as you log your OJT days.
              </Text>
            </View>
          ) : (
            history.map((record, index) => (
              <AttendanceHistoryItem
                key={record.id}
                record={record}
                isLast={index === history.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
