/**
 * iLogMo - Task Zustand Store
 * Client-side cached state for task list and status.
 */

import { create } from 'zustand';
import { Task } from '@/features/tasks/types';
import { sortTasks } from '@/features/tasks/utils/taskUtils';

export interface TaskStoreState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskStoreState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) =>
    set({
      tasks: sortTasks(tasks),
      isLoading: false,
      error: null,
    }),

  addTask: (task) =>
    set((state) => ({
      tasks: sortTasks([task, ...state.tasks.filter((t) => t.id !== task.id)]),
    })),

  updateTask: (task) =>
    set((state) => ({
      tasks: sortTasks(state.tasks.map((t) => (t.id === task.id ? task : t))),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearTasks: () =>
    set({
      tasks: [],
      isLoading: false,
      error: null,
    }),
}));

export default useTaskStore;
