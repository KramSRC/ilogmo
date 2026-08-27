-- ==============================================================================
-- iLogMo - Allow Multiple Journal Entries per Day
-- Migration: 20260828_allow_multiple_journal_entries_per_day.sql
-- ==============================================================================

-- 1. Drop unique constraint on (user_id, entry_date) if exists
ALTER TABLE public.journal_entries DROP CONSTRAINT IF EXISTS unique_user_journal_date;

-- 2. Re-create index for fast queries by user, date and creation time
DROP INDEX IF EXISTS idx_journal_entries_user_date;
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date 
  ON public.journal_entries (user_id, entry_date DESC, created_at DESC);
