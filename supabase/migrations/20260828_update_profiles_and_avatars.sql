-- ==============================================================================
-- iLogMo - Profiles Table Enhancements & Avatars Storage Bucket
-- Migration: 20260828_update_profiles_and_avatars.sql
-- ==============================================================================

-- 1. Add contact_number, username, and avatar_path to public.profiles table if not present
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS contact_number TEXT,
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_path TEXT;

-- 2. Index on username for fast lookup and uniqueness checks
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);

-- ==============================================================================
-- 3. Supabase Storage: Bucket & Security Policies for Avatars
-- Bucket Name: 'avatars' (Private, 5 MB limit)
-- Path Structure: avatars/{user_id}/profile.{extension}
-- ==============================================================================

-- Create bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  5242880, -- 5 MB limit in bytes
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880;

-- Storage Policies for 'avatars' bucket
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can read own avatar" ON storage.objects;
CREATE POLICY "Users can read own avatar"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
