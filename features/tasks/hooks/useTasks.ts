/**
 * iLogMo - useTasks Custom Hook
 * Provides reactive task list, status/priority filtering, derived counters, and CRUD actions.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { taskService } from '../services/taskService';
import {
  Task,
  TaskFormData,
  TaskFilter,
  TaskPriorityFilter,
  TaskStats,
  TaskActionResult,
} from '../types';
import { getTaskDueStatus } from '../utils/taskUtils';

export function useTasks() {
  const { user } = useAuthStore();
  const {
    tasks,
    isLoading: storeLoading,
    error: storeError,
    setTasks,
    addTask,
    updateTask: updateStoreTask,
    removeTask,
    setLoading,
    setError,
  } = useTaskStore();

  const [statusFilter, setStatusFilter] = useState<TaskFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilter>('all');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      if (!user?.id) {
        if (!isCancelled) {
          setTasks([]);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await taskService.getTasks(user.id);
        if (!isCancelled) {
          setTasks(data);
          setError(null);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('[useTasks] Load error:', err);
          setError('Unable to load your tasks.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [user, setTasks, setLoading, setError]);

  /**
   * Pull-to-refresh handler.
   */
  const refresh = useCallback(async () => {
    if (!user?.id) return;

    setIsRefreshing(true);
    try {
      const data = await taskService.getTasks(user.id);
      setTasks(data);
      setError(null);
    } catch (err: any) {
      console.warn('[useTasks.refresh] Error:', err);
      setError('Unable to refresh tasks.');
    } finally {
      setIsRefreshing(false);
    }
  }, [user, setTasks, setError]);

  /**
   * Toggle task completion (optimistic update).
   */
  const toggleTask = useCallback(
    async (id: string): Promise<TaskActionResult<Task>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const target = tasks.find((t) => t.id === id);
      if (!target) {
        return { success: false, error: 'Task not found.' };
      }

      const nextCompleted = !target.completed;
      const optimisticUpdated: Task = {
        ...target,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      };

      // Optimistic update
      updateStoreTask(optimisticUpdated);
      setIsTogglingId(id);

      try {
        const result = await taskService.toggleTaskComplete(user.id, id, nextCompleted);
        if (result.success && result.data) {
          updateStoreTask(result.data);
        } else {
          // Rollback on failure
          updateStoreTask(target);
        }
        return result;
      } catch (err: any) {
        updateStoreTask(target);
        return {
          success: false,
          error: err?.message || 'Unable to update task status.',
        };
      } finally {
        setIsTogglingId(null);
      }
    },
    [user, tasks, updateStoreTask]
  );

  /**
   * Create a new task.
   */
  const createTask = useCallback(
    async (formData: TaskFormData): Promise<TaskActionResult<Task>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsSaving(true);
      try {
        const result = await taskService.createTask(user.id, formData);
        if (result.success && result.data) {
          addTask(result.data);
        }
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [user, addTask]
  );

  /**
   * Update an existing task.
   */
  const updateTask = useCallback(
    async (id: string, formData: Partial<TaskFormData>): Promise<TaskActionResult<Task>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsSaving(true);
      try {
        const result = await taskService.updateTask(user.id, id, formData);
        if (result.success && result.data) {
          updateStoreTask(result.data);
        }
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [user, updateStoreTask]
  );

  /**
   * Delete a task.
   */
  const deleteTask = useCallback(
    async (id: string): Promise<TaskActionResult<boolean>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsDeleting(true);
      try {
        const result = await taskService.deleteTask(user.id, id);
        if (result.success) {
          removeTask(id);
        }
        return result;
      } finally {
        setIsDeleting(false);
      }
    },
    [user, removeTask]
  );

  /**
   * Fetch single task by ID.
   */
  const getTaskById = useCallback(
    async (id: string): Promise<Task | null> => {
      const cached = tasks.find((t) => t.id === id);
      if (cached) return cached;

      if (!user?.id) return null;
      return await taskService.getTaskById(user.id, id);
    },
    [tasks, user]
  );

  /**
   * Derived statistical counters.
   */
  const stats: TaskStats = useMemo(() => {
    let pending = 0;
    let completed = 0;
    let overdue = 0;
    let dueToday = 0;

    tasks.forEach((t) => {
      if (t.completed) {
        completed++;
      } else {
        pending++;
        const dueStatus = getTaskDueStatus(t.dueDate, false);
        if (dueStatus.isOverdue) overdue++;
        if (dueStatus.isDueToday) dueToday++;
      }
    });

    return {
      total: tasks.length,
      pending,
      completed,
      overdue,
      dueToday,
    };
  }, [tasks]);

  /**
   * Filtered tasks based on status and priority.
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Status Filter
      if (statusFilter === 'pending' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;

      // 2. Priority Filter
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

      return true;
    });
  }, [tasks, statusFilter, priorityFilter]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    stats,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    isLoading: storeLoading,
    isRefreshing,
    isSaving,
    isDeleting,
    isTogglingId,
    error: storeError,
    refresh,
    toggleTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
  };
}

export default useTasks;
