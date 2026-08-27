-- ==============================================================================
-- iLogMo - OJT Records Table Schema & Security Policies
-- Migration: 20260828_create_ojt_records.sql
-- ==============================================================================

-- 1. Create ojt_records table
CREATE TABLE IF NOT EXISTS public.ojt_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  department TEXT NOT NULL,
  supervisor_name TEXT,
  company_address TEXT,
  required_hours INTEGER NOT NULL CHECK (required_hours > 0 AND required_hours <= 10000),
  start_date DATE NOT NULL,
  expected_end_date DATE,
  working_days TEXT[] NOT NULL DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  expected_start_time TIME,
  expected_end_time TIME,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.ojt_records ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Users can view own ojt records" ON public.ojt_records;
CREATE POLICY "Users can view own ojt records"
  ON public.ojt_records FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ojt records" ON public.ojt_records;
CREATE POLICY "Users can insert own ojt records"
  ON public.ojt_records FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ojt records" ON public.ojt_records;
CREATE POLICY "Users can update own ojt records"
  ON public.ojt_records FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS on_ojt_records_updated ON public.ojt_records;
CREATE TRIGGER on_ojt_records_updated
  BEFORE UPDATE ON public.ojt_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Unique index for active OJT record per student
CREATE UNIQUE INDEX IF NOT EXISTS idx_ojt_active_user ON public.ojt_records (user_id) WHERE is_active = true;
