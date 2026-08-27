/**
 * iLogMo - useDashboard Hook
 * Connects Home/Dashboard state with dashboardService and user profile.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DashboardData } from '../types';
import { dashboardService } from '../services/dashboardService';
import { taskService } from '@/features/tasks/services/taskService';

export function useDashboard() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await dashboardService.getDashboardData(user?.id);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        console.warn('[useDashboard] Failed to load dashboard data:', err);
        if (isMounted) {
          setError('Unable to load your OJT information.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const result = await dashboardService.getDashboardData(user?.id);
      setData(result);
    } catch (err) {
      console.warn('[useDashboard] Failed to refresh dashboard data:', err);
      setError('Unable to load your OJT information.');
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  const toggleTask = useCallback(
    async (taskId: string) => {
      let nextState = false;

      setData((prev) => {
        if (!prev) return prev;
        const target = prev.tasks.find((t) => t.id === taskId);
        if (target) {
          nextState = !target.completed;
        }
        const updatedTasks = prev.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...prev, tasks: updatedTasks };
      });

      if (user?.id) {
        try {
          await taskService.toggleTaskComplete(user.id, taskId, nextState);
        } catch (err) {
          console.warn('[useDashboard.toggleTask] Error toggling task:', err);
        }
      }
    },
    [user]
  );

  // Derive first name greeting from profile or auth metadata
  const firstName = profile?.first_name || user?.user_metadata?.first_name || '';

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    firstName,
    profile,
    user,
    refresh,
    toggleTask,
  };
}

export default useDashboard;
