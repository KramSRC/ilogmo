/**
 * iLogMo - useCalendar Hook
 * Connects Calendar state, month navigation boundaries, and real Supabase attendance data.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { calendarService } from '../services/calendarService';
import { AttendanceRecord } from '@/features/attendance/types';
import {
  CalendarDay,
  MonthlyAttendanceSummary,
  SelectedDateDetails,
} from '../types/calendar.types';
import { getTodayDateString } from '@/features/attendance/utils/timeUtils';
import { addMonths, subMonths, startOfMonth, parseISO, isValid } from 'date-fns';

export function useCalendar() {
  const user = useAuthStore((state) => state.user);
  const activeOjt = useOjtStore((state) => state.activeOjt);

  const [selectedMonth, setSelectedMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => getTodayDateString());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [totalCompletedOverall, setTotalCompletedOverall] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Month navigation boundaries based on student's OJT start and expected end date
  const { canGoPrev, canGoNext } = useMemo(() => {
    let canPrev = true;
    let canNext = true;

    const currentMonthStart = startOfMonth(selectedMonth);

    // If OJT start_date is set, do not allow navigating before the start month
    if (activeOjt?.startDate && isValid(parseISO(activeOjt.startDate))) {
      const ojtStartMonth = startOfMonth(parseISO(activeOjt.startDate));
      if (currentMonthStart <= ojtStartMonth) {
        canPrev = false;
      }
    } else {
      // Default lower limit: 24 months in past
      const minPast = subMonths(startOfMonth(new Date()), 24);
      if (currentMonthStart <= minPast) {
        canPrev = false;
      }
    }

    // If OJT expected_end_date is set, do not allow navigating past that month
    if (activeOjt?.expectedEndDate && isValid(parseISO(activeOjt.expectedEndDate))) {
      const ojtEndMonth = startOfMonth(parseISO(activeOjt.expectedEndDate));
      if (currentMonthStart >= ojtEndMonth) {
        canNext = false;
      }
    } else {
      // Default upper limit: 12 months ahead from today
      const maxFuture = addMonths(startOfMonth(new Date()), 12);
      if (currentMonthStart >= maxFuture) {
        canNext = false;
      }
    }

    return { canGoPrev: canPrev, canGoNext: canNext };
  }, [selectedMonth, activeOjt]);

  // Load data effect whenever selectedMonth or user changes
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
        const [records, overallMinutes] = await Promise.all([
          calendarService.getMonthlyAttendanceRecords(user.id, selectedMonth),
          calendarService.getTotalCompletedMinutes(user.id),
        ]);

        if (isMounted) {
          setAttendanceRecords(records);
          setTotalCompletedOverall(overallMinutes);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useCalendar] Load error:', err);
          setError('Unable to load attendance for this month.');
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
  }, [user?.id, selectedMonth]);

  // Calendar days grid computation
  const calendarDays = useMemo<CalendarDay[]>(() => {
    return calendarService.generateCalendarGrid(
      selectedMonth,
      selectedDateStr,
      attendanceRecords,
      activeOjt
    );
  }, [selectedMonth, selectedDateStr, attendanceRecords, activeOjt]);

  // Monthly summary stats computation
  const monthlySummary = useMemo<MonthlyAttendanceSummary>(() => {
    return calendarService.calculateMonthlySummary(
      selectedMonth,
      calendarDays,
      attendanceRecords,
      activeOjt,
      totalCompletedOverall
    );
  }, [selectedMonth, calendarDays, attendanceRecords, activeOjt, totalCompletedOverall]);

  // Selected date details
  const selectedDay = useMemo(() => {
    return calendarDays.find((d) => d.dateString === selectedDateStr);
  }, [calendarDays, selectedDateStr]);

  const selectedDateDetails = useMemo<SelectedDateDetails | null>(() => {
    if (!selectedDay) return null;
    return calendarService.getSelectedDateDetails(selectedDay, activeOjt);
  }, [selectedDay, activeOjt]);

  // Actions
  const goToPreviousMonth = useCallback(() => {
    if (!canGoPrev) return;
    setSelectedMonth((prev) => subMonths(prev, 1));
  }, [canGoPrev]);

  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;
    setSelectedMonth((prev) => addMonths(prev, 1));
  }, [canGoNext]);

  const selectDate = useCallback((dateStr: string) => {
    setSelectedDateStr(dateStr);
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setSelectedMonth(startOfMonth(today));
    setSelectedDateStr(getTodayDateString(today));
  }, []);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setIsRefreshing(true);
    setError(null);
    try {
      const [records, overallMinutes] = await Promise.all([
        calendarService.getMonthlyAttendanceRecords(user.id, selectedMonth),
        calendarService.getTotalCompletedMinutes(user.id),
      ]);
      setAttendanceRecords(records);
      setTotalCompletedOverall(overallMinutes);
    } catch (err) {
      console.warn('[useCalendar] Refresh error:', err);
      setError('Unable to load attendance for this month.');
    } finally {
      setIsRefreshing(false);
    }
  }, [user, selectedMonth]);

  return {
    selectedMonth,
    selectedDateStr,
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
  };
}

export default useCalendar;
