/**
 * iLogMo - useJournal Custom Hook
 * Provides reactive journal state, data fetching, mutations, and OJT period validation.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { useJournalStore } from '@/store/journalStore';
import { journalService } from '../services/journalService';
import { JournalEntry, JournalFormData, JournalActionResult } from '../types';

export function useJournal() {
  const { user } = useAuthStore();
  const { activeOjt } = useOjtStore();
  const {
    entries,
    isLoading: storeLoading,
    error: storeError,
    setEntries,
    addEntry,
    updateEntry: updateStoreEntry,
    removeEntry,
    setLoading,
    setError,
  } = useJournalStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Load journal entries from Supabase.
   */
  const loadEntries = useCallback(async () => {
    if (!user?.id) {
      setEntries([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await journalService.getJournalEntries(user.id);
      setEntries(data);
    } catch (err: any) {
      console.warn('[useJournal.loadEntries] Error:', err);
      setError('Unable to load your journal entries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, setEntries, setLoading, setError]);

  /**
   * Pull-to-refresh handler.
   */
  const refresh = useCallback(async () => {
    if (!user?.id) return;

    setIsRefreshing(true);
    setError(null);

    try {
      const data = await journalService.getJournalEntries(user.id);
      setEntries(data);
    } catch (err: any) {
      console.warn('[useJournal.refresh] Error:', err);
      setError('Unable to refresh journal entries.');
    } finally {
      setIsRefreshing(false);
    }
  }, [user, setEntries, setError]);

  // Initial load
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  /**
   * Validates if a date string falls inside the active OJT configuration period.
   */
  const validateOjtDate = useCallback(
    (dateStr: string): { isValid: boolean; warning?: string } => {
      if (!dateStr || !activeOjt) {
        return { isValid: true };
      }

      if (activeOjt.startDate && dateStr < activeOjt.startDate) {
        return {
          isValid: false,
          warning: `This date is before your OJT start date (${activeOjt.startDate}).`,
        };
      }

      if (activeOjt.expectedEndDate && dateStr > activeOjt.expectedEndDate) {
        return {
          isValid: false,
          warning: `This date is after your expected OJT end date (${activeOjt.expectedEndDate}).`,
        };
      }

      return { isValid: true };
    },
    [activeOjt]
  );

  /**
   * Create a new journal entry.
   */
  const createEntry = useCallback(
    async (formData: JournalFormData): Promise<JournalActionResult<JournalEntry>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsSaving(true);
      try {
        const result = await journalService.createJournalEntry(user.id, formData);
        if (result.success && result.data) {
          addEntry(result.data);
        }
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [user, addEntry]
  );

  /**
   * Update an existing journal entry.
   */
  const updateEntry = useCallback(
    async (
      id: string,
      formData: Partial<JournalFormData>
    ): Promise<JournalActionResult<JournalEntry>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsSaving(true);
      try {
        const result = await journalService.updateJournalEntry(user.id, id, formData);
        if (result.success && result.data) {
          updateStoreEntry(result.data);
        }
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [user, updateStoreEntry]
  );

  /**
   * Delete a journal entry.
   */
  const deleteEntry = useCallback(
    async (id: string): Promise<JournalActionResult<boolean>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsDeleting(true);
      try {
        const result = await journalService.deleteJournalEntry(user.id, id);
        if (result.success) {
          removeEntry(id);
        }
        return result;
      } finally {
        setIsDeleting(false);
      }
    },
    [user, removeEntry]
  );

  /**
   * Find entry by ID (from store cache or database fallback).
   */
  const getEntryById = useCallback(
    async (id: string): Promise<JournalEntry | null> => {
      const cached = entries.find((e) => e.id === id);
      if (cached) return cached;

      if (!user?.id) return null;
      return await journalService.getJournalEntryById(user.id, id);
    },
    [entries, user]
  );

  /**
   * Find all entries for a specific date (from store cache or database fallback).
   */
  const getEntriesByDate = useCallback(
    async (dateStr: string): Promise<JournalEntry[]> => {
      const cached = entries.filter((e) => e.entryDate === dateStr);
      if (cached.length > 0) return cached;

      if (!user?.id) return [];
      return await journalService.getJournalEntriesByDate(user.id, dateStr);
    },
    [entries, user]
  );

  /**
   * Find first entry by date (convenience fallback).
   */
  const getEntryByDate = useCallback(
    async (dateStr: string): Promise<JournalEntry | null> => {
      const all = await getEntriesByDate(dateStr);
      return all.length > 0 ? all[0] : null;
    },
    [getEntriesByDate]
  );

  return {
    entries,
    isLoading: storeLoading,
    isRefreshing,
    isSaving,
    isDeleting,
    error: storeError,
    activeOjt,
    loadEntries,
    refresh,
    validateOjtDate,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    getEntryByDate,
    getEntriesByDate,
  };
}

export default useJournal;
