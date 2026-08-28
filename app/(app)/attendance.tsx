import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import {
  AttendanceHeader,
  TodayAttendanceCard,
  AttendanceConfirmationSheet,
  WeeklyOverviewCard,
  AttendanceHistory,
  AttendanceCalendarPreview,
  AttendanceSkeleton,
} from '@/features/attendance/components';
import { ErrorMessage, Button } from '@/components';
import { colors } from '@/constants/colors';

export default function AttendanceScreen() {
  const {
    todayRecord,
    weeklyStats,
    recentHistory,
    monthlyDays,
    workingDuration,
    isLoading,
    isRefreshing,
    isSubmitting,
    error,
    confirmationType,
    openCheckInConfirmation,
    openCheckOutConfirmation,
    closeConfirmation,
    confirmCheckIn,
    confirmCheckOut,
    refresh,
  } = useAttendance();

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right']}>
        <AttendanceSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary[600]}
            colors={[colors.primary[600]]}
          />
        }
        className="px-5 pt-3"
      >
        {/* 1. Header */}
        <AttendanceHeader />

        {/* Error Alert */}
        {error ? (
          <View className="mb-5">
            <ErrorMessage message={error} type="error" />
            <Button
              title="Try Again"
              onPress={refresh}
              variant="outline"
              size="sm"
              className="mt-2"
            />
          </View>
        ) : null}

        {/* 2. Today's Attendance Card */}
        <TodayAttendanceCard
          todayRecord={todayRecord}
          workingDuration={workingDuration}
          onPressCheckIn={openCheckInConfirmation}
          onPressCheckOut={openCheckOutConfirmation}
          isSubmitting={isSubmitting}
        />

        {/* 3. This Week Overview */}
        <WeeklyOverviewCard stats={weeklyStats} />

        {/* 4. Attendance History */}
        <AttendanceHistory records={recentHistory} />

        {/* 5. Monthly Calendar Preview */}
        <AttendanceCalendarPreview days={monthlyDays} />
      </ScrollView>

      {/* Check In / Check Out Confirmation Bottom Sheet / Dialog */}
      <AttendanceConfirmationSheet
        visible={confirmationType !== null}
        type={confirmationType}
        checkInTime={todayRecord?.checkIn}
        currentDuration={workingDuration}
        isSubmitting={isSubmitting}
        onConfirm={
          confirmationType === 'check_in' ? () => confirmCheckIn() : () => confirmCheckOut()
        }
        onCancel={closeConfirmation}
      />
    </SafeAreaView>
  );
}
