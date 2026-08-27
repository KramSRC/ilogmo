/**
 * iLogMo - Tasks Domain Types
 */

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';
export type TaskFilter = 'all' | 'pending' | 'completed';
export type TaskPriorityFilter = 'all' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  dueDate: string | null; // ISO date 'YYYY-MM-DD'
  priority: TaskPriority;
  completed: boolean;
  completedAt: string | null; // ISO timestamp
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
}

export interface TaskActionResult<T = Task> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  dueToday: number;
}
