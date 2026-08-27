/**
 * iLogMo - Tasks Service
 * Handles Supabase database interactions, validations, and mapping for Tasks.
 */

import { supabase } from '@/lib/supabase';
import { Task, TaskFormData, TaskActionResult } from '../types';
import { sortTasks } from '../utils/taskUtils';

/**
 * Maps raw Supabase database row to domain Task.
 */
function mapRowToTask(row: any): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description || null,
    dueDate: row.due_date || null,
    priority: (row.priority as Task['priority']) || 'medium',
    completed: Boolean(row.completed),
    completedAt: row.completed_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const taskService = {
  /**
   * Fetch all tasks for the authenticated user, sorted by priority and due date.
   */
  async getTasks(userId: string): Promise<Task[]> {
    try {
      if (!userId) return [];

      const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId);

      if (error) {
        console.warn('[taskService.getTasks] Error:', error.message);
        return [];
      }

      const tasks = (data || []).map(mapRowToTask);
      return sortTasks(tasks);
    } catch (err) {
      console.warn('[taskService.getTasks] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch a single task by ID.
   */
  async getTaskById(userId: string, id: string): Promise<Task | null> {
    try {
      if (!userId || !id) return null;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[taskService.getTaskById] Error:', error.message);
        return null;
      }

      return data ? mapRowToTask(data) : null;
    } catch (err) {
      console.warn('[taskService.getTaskById] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Create a new task.
   */
  async createTask(userId: string, formData: TaskFormData): Promise<TaskActionResult<Task>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const cleanTitle = formData.title?.trim() || '';
      if (cleanTitle.length < 3) {
        return { success: false, error: 'Task title must be at least 3 characters.' };
      }
      if (cleanTitle.length > 150) {
        return { success: false, error: 'Task title cannot exceed 150 characters.' };
      }

      const cleanDesc = formData.description?.trim() || null;
      if (cleanDesc && cleanDesc.length > 5000) {
        return { success: false, error: 'Description cannot exceed 5,000 characters.' };
      }

      const priority = formData.priority || 'medium';

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: cleanTitle,
          description: cleanDesc,
          due_date: formData.dueDate || null,
          priority,
          completed: false,
          completed_at: null,
        })
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to create task. Please try again.',
        };
      }

      return {
        success: true,
        data: mapRowToTask(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to create task. Please check your connection.',
      };
    }
  },

  /**
   * Update an existing task.
   */
  async updateTask(
    userId: string,
    id: string,
    formData: Partial<TaskFormData>
  ): Promise<TaskActionResult<Task>> {
    try {
      if (!userId || !id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (formData.title !== undefined) {
        const cleanTitle = formData.title.trim();
        if (cleanTitle.length < 3) {
          return { success: false, error: 'Task title must be at least 3 characters.' };
        }
        if (cleanTitle.length > 150) {
          return { success: false, error: 'Task title cannot exceed 150 characters.' };
        }
        updates.title = cleanTitle;
      }

      if (formData.description !== undefined) {
        const cleanDesc = formData.description?.trim() || null;
        if (cleanDesc && cleanDesc.length > 5000) {
          return { success: false, error: 'Description cannot exceed 5,000 characters.' };
        }
        updates.description = cleanDesc;
      }

      if (formData.dueDate !== undefined) {
        updates.due_date = formData.dueDate || null;
      }

      if (formData.priority !== undefined) {
        updates.priority = formData.priority;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to update task. Please try again.',
        };
      }

      return {
        success: true,
        data: mapRowToTask(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to update task. Please check your connection.',
      };
    }
  },

  /**
   * Toggle completion status of a task.
   */
  async toggleTaskComplete(
    userId: string,
    id: string,
    completed: boolean
  ): Promise<TaskActionResult<Task>> {
    try {
      if (!userId || !id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const nowIso = new Date().toISOString();
      const updates = {
        completed,
        completed_at: completed ? nowIso : null,
        updated_at: nowIso,
      };

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to update task status.',
        };
      }

      return {
        success: true,
        data: mapRowToTask(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to update task status. Please check your connection.',
      };
    }
  },

  /**
   * Delete a task by ID.
   */
  async deleteTask(userId: string, id: string): Promise<TaskActionResult<boolean>> {
    try {
      if (!userId || !id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', userId);

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to delete task. Please try again.',
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to delete task. Please check your connection.',
      };
    }
  },
};

export default taskService;
