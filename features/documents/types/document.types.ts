/**
 * iLogMo - Document Domain Types
 */

export type DocumentCategory =
  'requirements' | 'forms' | 'evaluation' | 'certificate' | 'school' | 'company' | 'other';

export interface Document {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  category: DocumentCategory;
  fileName: string;
  storagePath: string;
  fileType: string;
  fileSize: number; // In bytes
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface PickedFile {
  uri: string;
  name: string;
  size: number; // In bytes
  mimeType?: string;
}

export interface DocumentFormData {
  name: string;
  description?: string;
  category: DocumentCategory;
  file: PickedFile;
}

export interface DocumentActionResult<T = Document> {
  success: boolean;
  data?: T;
  error?: string;
}

export type DocumentFilterCategory = 'all' | DocumentCategory;
