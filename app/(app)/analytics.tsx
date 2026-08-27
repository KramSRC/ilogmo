/**
 * iLogMo - Analytics Screen
 * Comprehensive visual analytics dashboard tracking OJT progress, attendance rates,
 * weekly distribution, monthly summaries, and completion forecasting.
 */

import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalytics } from '@/features/analytics';
import {
  OverallProgressCard,
  AttendanceOverviewCard,
  WeeklyHoursCard,
  MonthlyProgressCard,
  EstimatedCompletionCard,
  InsightsCard,
  AnalyticsSkeleton,
} from '@/features/analytics/components';
import { Button, ErrorMessage, NotificationBellButton } from '@/components';
import { colors } from '@/constants/colors';

export default function AnalyticsScreen() {
  const { data, isLoading, isRefreshing, error, refresh, goToPrevMonth, goToNextMonth } =
    useAnalytics();

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
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
        {/* 1. Header Section */}
        <View className="flex-row items-center justify-between pb-4">
          <View className="flex-1 mr-3">
            <Text className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
              Analytics
            </Text>
            <Text className="text-xs font-sans text-neutral-500 mt-0.5">Track your OJT progress</Text>
          </View>

          {/* Notification Bell */}
          <NotificationBellButton />
        </View>

        {/* 2. Error Display */}
        {error ? (
          <View className="mb-4">
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

        {/* 3. Loading Skeleton */}
        {isLoading && !isRefreshing ? (
          <AnalyticsSkeleton />
        ) : data ? (
          /* 4. Analytics Content */
          <View>
            {/* 1. Overall OJT Progress Card */}
            <OverallProgressCard progress={data.overall} />

            {/* 2. Attendance Overview Card (Present, Late, Absent, Day Off, Avg Hours) */}
            <AttendanceOverviewCard overview={data.attendanceOverview} />

            {/* 3. Weekly Hours Chart */}
            <WeeklyHoursCard weekly={data.thisWeek} />

            {/* 4. Monthly Progress & Weekly Breakdown */}
            <MonthlyProgressCard
              monthly={data.monthly}
              onPrevMonth={goToPrevMonth}
              onNextMonth={goToNextMonth}
            />

            {/* 5. Estimated Completion Forecast */}
            <EstimatedCompletionCard estimate={data.estimate} />

            {/* 6. Calculated Insights */}
            <InsightsCard insights={data.insights} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
