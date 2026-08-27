/**
 * iLogMo - Document Service
 * Handles Supabase database queries, file storage uploads, signed URL generation, and cleanup for Documents.
 */

import { supabase } from '@/lib/supabase';
import { Document, DocumentCategory, DocumentFormData, DocumentActionResult } from '../types';
import { MAX_FILE_SIZE_BYTES } from '../utils/documentUtils';

/**
 * Maps raw Supabase database row to domain Document model.
 */
function mapRowToDocument(row: any): Document {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description || null,
    category: row.category as DocumentCategory,
    fileName: row.file_name,
    storagePath: row.storage_path,
    fileType: row.file_type,
    fileSize:
      typeof row.file_size === 'string' ? parseInt(row.file_size, 10) : Number(row.file_size),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Clean and sanitize a filename for cloud storage key safety.
 */
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
}

/**
 * Safe client-side UUID generator compatible with React Native and Web.
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fall through to fallback
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const documentService = {
  /**
   * Fetch all documents for a user, with optional category filtering.
   */
  async getDocuments(userId: string, category?: DocumentCategory): Promise<Document[]> {
    try {
      if (!userId) return [];

      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('[documentService.getDocuments] Error:', error.message);
        return [];
      }

      return (data || []).map(mapRowToDocument);
    } catch (err) {
      console.warn('[documentService.getDocuments] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch a single document by ID.
   */
  async getDocumentById(userId: string, id: string): Promise<Document | null> {
    try {
      if (!userId || !id) return null;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[documentService.getDocumentById] Error:', error.message);
        return null;
      }

      return data ? mapRowToDocument(data) : null;
    } catch (err) {
      console.warn('[documentService.getDocumentById] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Upload file to Supabase Storage and create metadata record in database.
   */
  async createDocument(
    userId: string,
    formData: DocumentFormData
  ): Promise<DocumentActionResult<Document>> {
    let uploadedStoragePath: string | null = null;

    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      // 1. Validations
      const cleanName = formData.name?.trim();
      if (!cleanName) {
        return { success: false, error: 'Document name is required.' };
      }
      if (cleanName.length > 150) {
        return { success: false, error: 'Document name cannot exceed 150 characters.' };
      }

      if (!formData.category) {
        return { success: false, error: 'Please select a document category.' };
      }

      if (!formData.file || !formData.file.uri) {
        return { success: false, error: 'Please select a file to upload.' };
      }

      if (formData.file.size > MAX_FILE_SIZE_BYTES) {
        return {
          success: false,
          error: 'File is too large. Please select a file smaller than 10 MB.',
        };
      }

      const cleanDescription = formData.description?.trim() || null;
      if (cleanDescription && cleanDescription.length > 1000) {
        return { success: false, error: 'Description cannot exceed 1,000 characters.' };
      }

      // 2. Generate a client-side UUID for storage isolation
      const documentId = generateUUID();

      const originalFileName = formData.file.name || 'document.pdf';
      const safeFileName = sanitizeFileName(originalFileName);
      const storagePath = `${userId}/${documentId}/${safeFileName}`;

      // 3. Prepare File Binary as ArrayBuffer (React Native compatible)
      const fileResponse = await fetch(formData.file.uri);
      const fileBuffer = await fileResponse.arrayBuffer();

      // 4. Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(storagePath, fileBuffer, {
          contentType: formData.file.mimeType || 'application/octet-stream',
          upsert: true,
        });

      if (storageError) {
        console.warn(
          '[documentService.createDocument] Storage Upload Error:',
          storageError.message
        );
        return {
          success: false,
          error: storageError.message || 'Unable to upload file to storage. Please try again.',
        };
      }

      uploadedStoragePath = storagePath;

      // 5. Insert metadata into public.documents table
      const fileExt = originalFileName.split('.').pop()?.toUpperCase() || 'FILE';

      const { data, error: dbError } = await supabase
        .from('documents')
        .insert({
          id: documentId,
          user_id: userId,
          name: cleanName,
          description: cleanDescription,
          category: formData.category,
          file_name: originalFileName,
          storage_path: storagePath,
          file_type: fileExt,
          file_size: formData.file.size,
        })
        .select('*')
        .single();

      if (dbError) {
        console.warn('[documentService.createDocument] DB Insert Error:', dbError.message);
        // Attempt rollback of uploaded storage file
        await this.deleteStorageFile(storagePath);
        return {
          success: false,
          error: dbError.message || 'Unable to save this document.',
        };
      }

      return {
        success: true,
        data: mapRowToDocument(data),
      };
    } catch (err: any) {
      console.warn('[documentService.createDocument] Unexpected error:', err);
      if (uploadedStoragePath) {
        await this.deleteStorageFile(uploadedStoragePath);
      }
      return {
        success: false,
        error:
          err?.message ||
          'Unable to save this document. Please check your connection and try again.',
      };
    }
  },

  /**
   * Generate a short-lived signed URL to securely view/download the document.
   */
  async getSignedUrl(storagePath: string, expiresInSeconds: number = 300): Promise<string | null> {
    try {
      if (!storagePath) return null;

      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, expiresInSeconds);

      if (error) {
        console.warn('[documentService.getSignedUrl] Error:', error.message);
        return null;
      }

      return data?.signedUrl || null;
    } catch (err) {
      console.warn('[documentService.getSignedUrl] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Delete a document database row and its storage binary.
   */
  async deleteDocument(
    userId: string,
    id: string,
    storagePath: string
  ): Promise<DocumentActionResult<boolean>> {
    try {
      if (!userId || !id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      // 1. Delete database record
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (dbError) {
        return {
          success: false,
          error: dbError.message || 'Unable to delete document metadata.',
        };
      }

      // 2. Delete storage file if path is present
      if (storagePath) {
        await this.deleteStorageFile(storagePath);
      }

      return {
        success: true,
        data: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to delete document. Please check your connection.',
      };
    }
  },

  /**
   * Helper to safely remove a file from Supabase Storage.
   */
  async deleteStorageFile(storagePath: string): Promise<boolean> {
    try {
      if (!storagePath) return false;

      const { error } = await supabase.storage.from('documents').remove([storagePath]);

      if (error) {
        console.warn('[documentService.deleteStorageFile] Storage Delete Warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[documentService.deleteStorageFile] Unexpected error:', err);
      return false;
    }
  },
};

export default documentService;
