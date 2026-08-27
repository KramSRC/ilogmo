/**
 * iLogMo - Journal Zustand Store
 * Client-side cached state for journal entries and status.
 */

import { create } from 'zustand';
import { JournalEntry } from '@/features/journal/types';

export interface JournalStoreState {
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
  setEntries: (entries: JournalEntry[]) => void;
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (entry: JournalEntry) => void;
  removeEntry: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearEntries: () => void;
}

export const useJournalStore = create<JournalStoreState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  setEntries: (entries) =>
    set({
      entries,
      isLoading: false,
      error: null,
    }),

  addEntry: (entry) =>
    set((state) => ({
      // Keep sorted by entryDate descending
      entries: [entry, ...state.entries.filter((e) => e.id !== entry.id)].sort((a, b) =>
        b.entryDate.localeCompare(a.entryDate)
      ),
    })),

  updateEntry: (entry) =>
    set((state) => ({
      entries: state.entries
        .map((e) => (e.id === entry.id ? entry : e))
        .sort((a, b) => b.entryDate.localeCompare(a.entryDate)),
    })),

  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearEntries: () =>
    set({
      entries: [],
      isLoading: false,
      error: null,
    }),
}));

export default useJournalStore;
