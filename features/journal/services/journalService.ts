/**
 * iLogMo - Journal Service
 * Handles Supabase database interactions, queries, validations, and mapping for Journal entries.
 */

import { supabase } from '@/lib/supabase';
import { JournalEntry, JournalFormData, JournalActionResult } from '../types';

/**
 * Maps raw Supabase row to domain JournalEntry.
 */
function mapRowToJournalEntry(row: any): JournalEntry {
  return {
    id: row.id,
    userId: row.user_id,
    entryDate: row.entry_date,
    workDescription: row.work_description,
    learningDescription: row.learning_description,
    challenges: row.challenges || null,
    notes: row.notes || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const journalService = {
  /**
   * Fetch all journal entries for the current user, ordered newest date and creation time first.
   */
  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    try {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[journalService.getJournalEntries] Error:', error.message);
        return [];
      }

      return (data || []).map(mapRowToJournalEntry);
    } catch (err) {
      console.warn('[journalService.getJournalEntries] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch a single journal entry by ID.
   */
  async getJournalEntryById(userId: string, id: string): Promise<JournalEntry | null> {
    try {
      if (!userId || !id) return null;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[journalService.getJournalEntryById] Error:', error.message);
        return null;
      }

      return data ? mapRowToJournalEntry(data) : null;
    } catch (err) {
      console.warn('[journalService.getJournalEntryById] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Fetch all journal entries for a specific date.
   */
  async getJournalEntriesByDate(userId: string, dateStr: string): Promise<JournalEntry[]> {
    try {
      if (!userId || !dateStr) return [];

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('entry_date', dateStr)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[journalService.getJournalEntriesByDate] Error:', error.message);
        return [];
      }

      return (data || []).map(mapRowToJournalEntry);
    } catch (err) {
      console.warn('[journalService.getJournalEntriesByDate] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Create a new journal entry.
   */
  async createJournalEntry(
    userId: string,
    formData: JournalFormData
  ): Promise<JournalActionResult<JournalEntry>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      // 1. Validation
      if (!formData.entryDate) {
        return { success: false, error: 'Please select a date for your journal entry.' };
      }

      const cleanWork = formData.workDescription?.trim() || '';
      if (cleanWork.length < 3) {
        return { success: false, error: "Today's Work must be at least 3 characters long." };
      }
      if (cleanWork.length > 10000) {
        return { success: false, error: "Today's Work cannot exceed 10,000 characters." };
      }

      const cleanLearning = formData.learningDescription?.trim() || '';
      if (cleanLearning.length < 3) {
        return { success: false, error: 'What I Learned must be at least 3 characters long.' };
      }
      if (cleanLearning.length > 10000) {
        return { success: false, error: 'What I Learned cannot exceed 10,000 characters.' };
      }

      // 2. Insert into Supabase
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          entry_date: formData.entryDate,
          work_description: cleanWork,
          learning_description: cleanLearning,
          challenges: formData.challenges?.trim() || null,
          notes: formData.notes?.trim() || null,
        })
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to save your journal entry. Please try again.',
        };
      }

      return {
        success: true,
        data: mapRowToJournalEntry(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Unable to save your journal entry. Please check your connection and try again.',
      };
    }
  },

  /**
   * Update an existing journal entry.
   */
  async updateJournalEntry(
    userId: string,
    id: string,
    formData: Partial<JournalFormData>
  ): Promise<JournalActionResult<JournalEntry>> {
    try {
      if (!userId || !id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (formData.entryDate !== undefined) {
        if (!formData.entryDate) {
          return { success: false, error: 'Please select a valid date.' };
        }
        updates.entry_date = formData.entryDate;
      }

      if (formData.workDescription !== undefined) {
        const cleanWork = formData.workDescription.trim();
        if (cleanWork.length < 3) {
          return { success: false, error: "Today's Work must be at least 3 characters long." };
        }
        if (cleanWork.length > 10000) {
          return { success: false, error: "Today's Work cannot exceed 10,000 characters." };
        }
        updates.work_description = cleanWork;
      }

      if (formData.learningDescription !== undefined) {
        const cleanLearning = formData.learningDescription.trim();
        if (cleanLearning.length < 3) {
          return { success: false, error: 'What I Learned must be at least 3 characters long.' };
        }
        if (cleanLearning.length > 10000) {
          return { success: false, error: 'What I Learned cannot exceed 10,000 characters.' };
        }
        updates.learning_description = cleanLearning;
      }

      if (formData.challenges !== undefined) {
        updates.challenges = formData.challenges?.trim() || null;
      }

      if (formData.notes !== undefined) {
        updates.notes = formData.notes?.trim() || null;
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to update your journal entry. Please try again.',
        };
      }

      return {
        success: true,
        data: mapRowToJournalEntry(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          'Unable to update your journal entry. Please check your connection and try again.',
      };
    }
  },

  /**
   * Delete a journal entry.
   */
  async deleteJournalEntry(userId: string, id: string): Promise<JournalActionResult<boolean>> {
    try {
      if (!userId || !id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to delete journal entry. Please try again.',
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to delete journal entry. Please check your connection.',
      };
    }
  },
};

export default journalService;
