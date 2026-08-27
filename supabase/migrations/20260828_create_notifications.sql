-- ==============================================================================
-- iLogMo - Notifications & Notification Settings Schema & RLS Policies
-- Migration: 20260828_create_notifications.sql
-- ==============================================================================

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'attendance_reminder',
    'checkout_reminder',
    'task_reminder',
    'overdue_task',
    'journal_reminder',
    'ojt_reminder'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  related_type TEXT CHECK (related_type IN ('attendance', 'task', 'journal', 'ojt') OR related_type IS NULL),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable RLS on public.notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Database RLS Policies for notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
CREATE POLICY "Users can insert own notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index on notifications for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
  ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications (user_id, read_at) 
  WHERE read_at IS NULL;

-- ==============================================================================
-- 4. Create notification_settings table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  attendance_reminders BOOLEAN NOT NULL DEFAULT true,
  checkout_reminders BOOLEAN NOT NULL DEFAULT true,
  task_reminders BOOLEAN NOT NULL DEFAULT true,
  journal_reminders BOOLEAN NOT NULL DEFAULT true,
  ojt_reminders BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Enable RLS on public.notification_settings
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- 6. Database RLS Policies for notification_settings
DROP POLICY IF EXISTS "Users can view own notification settings" ON public.notification_settings;
CREATE POLICY "Users can view own notification settings"
  ON public.notification_settings
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notification settings" ON public.notification_settings;
CREATE POLICY "Users can insert own notification settings"
  ON public.notification_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notification settings" ON public.notification_settings;
CREATE POLICY "Users can update own notification settings"
  ON public.notification_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Trigger for automatic updated_at timestamp on notification_settings
DROP TRIGGER IF EXISTS on_notification_settings_updated ON public.notification_settings;
CREATE TRIGGER on_notification_settings_updated
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
