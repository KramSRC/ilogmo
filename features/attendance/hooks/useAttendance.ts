/**
 * iLogMo - useAttendance Hook
 * State management, live 1-minute working timer, confirmations, and Supabase synchronization.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  AttendanceRecord,
  WeeklyAttendanceStats,
  MonthlyCalendarDay,
  CheckInPayload,
  CheckOutPayload,
  AttendanceActionResult,
} from '../types';
import { attendanceService } from '../services/attendanceService';
import { calculateElapsedMinutes, formatHoursMinutes } from '../utils/timeUtils';

const DEFAULT_WEEKLY_STATS: WeeklyAttendanceStats = {
  totalMinutes: 0,
  totalHoursFormatted: '0h 00m',
  daysPresent: 0,
  lateMinutes: 0,
  lateHoursFormatted: '0h 00m',
  attendanceRate: 0,
};

export function useAttendance() {
  const { user } = useAuth();
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyAttendanceStats>(DEFAULT_WEEKLY_STATS);
  const [recentHistory, setRecentHistory] = useState<AttendanceRecord[]>([]);
  const [monthlyDays, setMonthlyDays] = useState<MonthlyCalendarDay[]>([]);
  const [workingDuration, setWorkingDuration] = useState<string>('0h 00m');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmationType, setConfirmationType] = useState<'check_in' | 'check_out' | null>(null);

  // 1. Fetch All Attendance Data on Mount
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
        const [today, stats, history, monthly] = await Promise.all([
          attendanceService.getTodayAttendance(user.id),
          attendanceService.getWeeklyOverview(user.id),
          attendanceService.getAttendanceHistory(user.id, 5),
          attendanceService.getMonthlyCalendarPreview(user.id),
        ]);

        if (isMounted) {
          setTodayRecord(today);
          setWeeklyStats(stats);
          setRecentHistory(history);
          setMonthlyDays(monthly);

          if (today?.status === 'working' && today?.checkIn) {
            const minutes = calculateElapsedMinutes(today.checkIn, null, today.breakMinutes);
            setWorkingDuration(formatHoursMinutes(minutes));
          } else if (
            today?.status === 'completed' &&
            today.totalMinutes !== undefined &&
            today.totalMinutes !== null
          ) {
            setWorkingDuration(formatHoursMinutes(today.totalMinutes));
          } else {
            setWorkingDuration('0h 00m');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useAttendance] Load error:', err);
          setError('Unable to load attendance. Please check your connection.');
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

  // 2. Refresh callback for pull-to-refresh & mutations
  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setIsRefreshing(true);
    setError(null);

    try {
      const [today, stats, history, monthly] = await Promise.all([
        attendanceService.getTodayAttendance(user.id),
        attendanceService.getWeeklyOverview(user.id),
        attendanceService.getAttendanceHistory(user.id, 5),
        attendanceService.getMonthlyCalendarPreview(user.id),
      ]);

      setTodayRecord(today);
      setWeeklyStats(stats);
      setRecentHistory(history);
      setMonthlyDays(monthly);

      if (today?.status === 'working' && today?.checkIn) {
        const minutes = calculateElapsedMinutes(today.checkIn, null, today.breakMinutes);
        setWorkingDuration(formatHoursMinutes(minutes));
      } else if (
        today?.status === 'completed' &&
        today.totalMinutes !== undefined &&
        today.totalMinutes !== null
      ) {
        setWorkingDuration(formatHoursMinutes(today.totalMinutes));
      } else {
        setWorkingDuration('0h 00m');
      }
    } catch (err) {
      console.warn('[useAttendance] Refresh error:', err);
      setError('Unable to load attendance. Please check your connection.');
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  // 3. Live 1-Minute Elapsed Timer (Driven by database check_in timestamp)
  useEffect(() => {
    if (!todayRecord || todayRecord.status !== 'working' || !todayRecord.checkIn) {
      return;
    }

    const updateTimer = () => {
      const minutes = calculateElapsedMinutes(todayRecord.checkIn, null, todayRecord.breakMinutes);
      setWorkingDuration(formatHoursMinutes(minutes));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 30000); // update every 30s

    return () => clearInterval(interval);
  }, [todayRecord]);

  // 4. Check In Action
  const checkIn = async (payload?: CheckInPayload): Promise<AttendanceActionResult> => {
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated.' };
    }

    setIsSubmitting(true);
    setError(null);

    const result = await attendanceService.checkIn(user.id, payload);
    setIsSubmitting(false);

    if (result.success && result.data) {
      setTodayRecord(result.data);
      setConfirmationType(null);
      refresh();
    } else {
      setError(result.error || 'Failed to check in.');
    }

    return result;
  };

  // 5. Check Out Action
  const checkOut = async (payload?: CheckOutPayload): Promise<AttendanceActionResult> => {
    if (!user?.id || !todayRecord?.id) {
      return { success: false, error: 'No active attendance record found.' };
    }

    setIsSubmitting(true);
    setError(null);

    const result = await attendanceService.checkOut(user.id, todayRecord.id, payload);
    setIsSubmitting(false);

    if (result.success && result.data) {
      setTodayRecord(result.data);
      setConfirmationType(null);
      if (result.data.totalMinutes) {
        setWorkingDuration(formatHoursMinutes(result.data.totalMinutes));
      }
      refresh();
    } else {
      setError(result.error || 'Failed to check out.');
    }

    return result;
  };

  return {
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
    openCheckInConfirmation: () => setConfirmationType('check_in'),
    openCheckOutConfirmation: () => setConfirmationType('check_out'),
    closeConfirmation: () => setConfirmationType(null),
    confirmCheckIn: checkIn,
    confirmCheckOut: checkOut,
    refresh,
  };
}

export default useAttendance;
