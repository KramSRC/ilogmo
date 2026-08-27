-- ==============================================================================
-- iLogMo - Documents Table Schema, RLS Policies & Storage Configuration
-- Migration: 20260828_create_documents.sql
-- ==============================================================================

-- 1. Create documents metadata table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('requirements', 'forms', 'evaluation', 'certificate', 'school', 'company', 'other')),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS) on public.documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 3. Database RLS Policies (Users can only access their own documents)
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
CREATE POLICY "Users can view own documents"
  ON public.documents
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
CREATE POLICY "Users can insert own documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
CREATE POLICY "Users can update own documents"
  ON public.documents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;
CREATE POLICY "Users can delete own documents"
  ON public.documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS on_documents_updated ON public.documents;
CREATE TRIGGER on_documents_updated
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Index for faster queries by user, category and date
CREATE INDEX IF NOT EXISTS idx_documents_user_category_date 
  ON public.documents (user_id, category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_documents_user_created 
  ON public.documents (user_id, created_at DESC);

-- ==============================================================================
-- 6. Supabase Storage: Bucket & Storage Security Policies
-- Bucket Name: 'documents' (Private, 10MB limit)
-- ==============================================================================

-- Create bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10 MB limit in bytes
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760;

-- Storage Policies for 'documents' bucket
-- Storage path structure: documents/{user_id}/{document_id}/{file_name}

DROP POLICY IF EXISTS "Users can upload own document files" ON storage.objects;
CREATE POLICY "Users can upload own document files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can read own document files" ON storage.objects;
CREATE POLICY "Users can read own document files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update own document files" ON storage.objects;
CREATE POLICY "Users can update own document files"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own document files" ON storage.objects;
CREATE POLICY "Users can delete own document files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
