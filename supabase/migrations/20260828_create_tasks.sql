-- ==============================================================================
-- iLogMo - Tasks Table Schema & Security Policies
-- Migration: 20260828_create_tasks.sql
-- ==============================================================================

-- 1. Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks"
  ON public.tasks
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own tasks"
  ON public.tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own tasks"
  ON public.tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks"
  ON public.tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS on_tasks_updated ON public.tasks;
CREATE TRIGGER on_tasks_updated
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks (user_id, completed, due_date ASC);
