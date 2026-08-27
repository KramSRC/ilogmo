/**
 * iLogMo - Journal Domain Types
 */

export interface JournalEntry {
  id: string;
  userId: string;
  entryDate: string; // ISO date 'YYYY-MM-DD'
  workDescription: string;
  learningDescription: string;
  challenges: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalFormData {
  entryDate: string;
  workDescription: string;
  learningDescription: string;
  challenges?: string;
  notes?: string;
}

export interface JournalActionResult<T = JournalEntry> {
  success: boolean;
  data?: T;
  error?: string;
}
