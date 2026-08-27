-- ==============================================================================
-- iLogMo - Journal Entries Table Schema & Security Policies
-- Migration: 20260828_create_journal_entries.sql
-- ==============================================================================

-- 1. Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  work_description TEXT NOT NULL,
  learning_description TEXT NOT NULL,
  challenges TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_journal_date UNIQUE (user_id, entry_date)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Users can view own journal entries" ON public.journal_entries;
CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own journal entries" ON public.journal_entries;
CREATE POLICY "Users can insert own journal entries"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own journal entries" ON public.journal_entries;
CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own journal entries" ON public.journal_entries;
CREATE POLICY "Users can delete own journal entries"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS on_journal_entries_updated ON public.journal_entries;
CREATE TRIGGER on_journal_entries_updated
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Index for faster queries by user and date (newest first)
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON public.journal_entries (user_id, entry_date DESC);
