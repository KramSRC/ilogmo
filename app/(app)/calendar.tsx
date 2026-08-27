import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalendar } from '@/features/calendar';
import {
  CalendarHeader,
  MonthNavigator,
  CalendarGrid,
  CalendarLegend,
  SelectedDateCard,
  MonthlySummaryCard,
  CalendarSkeleton,
} from '@/features/calendar/components';
import { ErrorMessage, Button } from '@/components';
import { isSameMonth } from 'date-fns';
import { colors } from '@/constants/colors';

export default function CalendarScreen() {
  const {
    selectedMonth,
    calendarDays,
    monthlySummary,
    selectedDateDetails,
    canGoPrev,
    canGoNext,
    isLoading,
    isRefreshing,
    error,
    goToPreviousMonth,
    goToNextMonth,
    selectDate,
    goToToday,
    refresh,
  } = useCalendar();

  const isCurrentMonth = isSameMonth(selectedMonth, new Date());

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
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
        {/* 1. Header with Back Button and Quick Jump to Today */}
        <CalendarHeader onPressToday={goToToday} showTodayButton={!isCurrentMonth} />

        {/* Error Alert */}
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

        {/* 2. Loading Skeleton or Full Calendar Content */}
        {isLoading && !isRefreshing ? (
          <CalendarSkeleton />
        ) : (
          <View>
            {/* 3. Month Navigation */}
            <MonthNavigator
              selectedMonth={selectedMonth}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              onPrevMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
            />

            {/* 4. Calendar Days Grid */}
            <CalendarGrid days={calendarDays} onSelectDate={selectDate} />

            {/* 5. Attendance Legend */}
            <CalendarLegend />

            {/* 6. Selected Date Details Card */}
            <SelectedDateCard details={selectedDateDetails} />

            {/* 7. Monthly Summary Stats Card */}
            <MonthlySummaryCard summary={monthlySummary} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
