import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import {
  DashboardHeader,
  ProgressCard,
  AttendanceSummaryCard,
  QuickActionGrid,
  TodayTasks,
  RecentJournalCard,
  ReminderCard,
  DashboardSkeleton,
} from '@/features/dashboard/components';
import { ErrorMessage, Button } from '@/components';
import { colors } from '@/constants/colors';

export default function HomeScreen() {
  const { data, isLoading, isRefreshing, error, firstName, refresh, toggleTask } = useDashboard();

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

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
        {/* 1. Header */}
        <DashboardHeader firstName={firstName} />

        {/* Error State Banner */}
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

        {data ? (
          <>
            {/* 2. OJT Progress Card */}
            <ProgressCard progress={data.progress} />

            {/* 3. Today's Attendance Card */}
            <AttendanceSummaryCard attendance={data.attendance} />

            {/* 4. Quick Actions */}
            <QuickActionGrid />

            {/* 5. Today's Tasks */}
            <TodayTasks tasks={data.tasks} onToggleTask={toggleTask} />

            {/* 6. Recent Journal */}
            <RecentJournalCard journal={data.recentJournal} />

            {/* 7. Upcoming Reminder */}
            <ReminderCard reminder={data.reminder} />
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
