-- ==============================================================================
-- iLogMo - Attendance Table Schema & Security Policies
-- Migration: 20260828_create_attendance.sql
-- ==============================================================================

-- 1. Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  break_minutes INTEGER NOT NULL DEFAULT 0,
  total_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'working',
  notes TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_accuracy DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_attendance_date UNIQUE (user_id, attendance_date)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Users can view own attendance" ON public.attendance;
CREATE POLICY "Users can view own attendance"
  ON public.attendance
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attendance" ON public.attendance;
CREATE POLICY "Users can insert own attendance"
  ON public.attendance
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attendance" ON public.attendance;
CREATE POLICY "Users can update own attendance"
  ON public.attendance
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS on_attendance_updated ON public.attendance;
CREATE TRIGGER on_attendance_updated
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Index for faster queries by user and date
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON public.attendance (user_id, attendance_date DESC);
