/**
 * iLogMo - useAnalytics Custom Hook
 * Connects UI with analytics calculations, monthly navigation, and pull-to-refresh state.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsData } from '../types';
import { subMonths, addMonths } from 'date-fns';

export function useAnalytics() {
  const { user } = useAuthStore();
  const { activeOjt } = useOjtStore();

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load analytics when user, activeOjt, or selectedMonth changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      if (!user?.id) {
        if (!isCancelled) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const result = await analyticsService.getAnalyticsData(user.id, selectedMonth, activeOjt);
        if (!isCancelled) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('[useAnalytics] Error fetching data:', err);
          setError('Unable to load your analytics. Please try again.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [user, activeOjt, selectedMonth]);

  /**
   * Pull-to-refresh handler.
   */
  const refresh = useCallback(async () => {
    if (!user?.id) return;

    setIsRefreshing(true);
    try {
      const result = await analyticsService.getAnalyticsData(user.id, selectedMonth, activeOjt);
      setData(result);
      setError(null);
    } catch (err: any) {
      console.warn('[useAnalytics.refresh] Error:', err);
      setError('Unable to refresh your analytics.');
    } finally {
      setIsRefreshing(false);
    }
  }, [user, activeOjt, selectedMonth]);

  /**
   * Navigate to previous month.
   */
  const goToPrevMonth = useCallback(() => {
    setSelectedMonth((prev) => subMonths(prev, 1));
  }, []);

  /**
   * Navigate to next month.
   */
  const goToNextMonth = useCallback(() => {
    setSelectedMonth((prev) => addMonths(prev, 1));
  }, []);

  return {
    data,
    selectedMonth,
    isLoading,
    isRefreshing,
    error,
    refresh,
    goToPrevMonth,
    goToNextMonth,
    setSelectedMonth,
  };
}

export default useAnalytics;
