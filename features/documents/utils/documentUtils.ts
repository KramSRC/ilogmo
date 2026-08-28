/**
 * iLogMo - Document Utilities
 * Helper functions for file formatting, categories, date conversions, and file type classification.
 */

import { format, parseISO, isValid } from 'date-fns';
import { DocumentCategory, DocumentFilterCategory } from '../types';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  requirements: 'Requirements',
  forms: 'Forms',
  evaluation: 'Evaluation',
  certificate: 'Certificate',
  school: 'School',
  company: 'Company',
  other: 'Other',
};

export const CATEGORY_OPTIONS: { value: DocumentCategory; label: string }[] = [
  { value: 'requirements', label: 'Requirements' },
  { value: 'forms', label: 'Forms' },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'school', label: 'School' },
  { value: 'company', label: 'Company' },
  { value: 'other', label: 'Other' },
];

export const FILTER_OPTIONS: { value: DocumentFilterCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  ...CATEGORY_OPTIONS,
];

/**
 * Formats raw file size in bytes to human-readable string (e.g. 850 KB, 2.4 MB).
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    const kb = (bytes / 1024).toFixed(bytes % 1024 === 0 ? 0 : 1);
    return `${kb} KB`;
  }
  const mb = (bytes / (1024 * 1024)).toFixed(1);
  return `${mb} MB`;
}

/**
 * Formats an ISO date string into friendly display format (e.g. "August 28, 2026").
 */
export function formatUploadDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parsed = parseISO(dateStr);
    if (isValid(parsed)) {
      return format(parsed, 'MMMM d, yyyy');
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export type FileKind = 'pdf' | 'doc' | 'sheet' | 'slide' | 'image' | 'text' | 'other';

export interface FileTypeDetails {
  extension: string;
  kind: FileKind;
  badge: string;
  color: string;
  bg: string;
}

/**
 * Analyzes filename and mimeType to return display badge, color theme, and file kind.
 */
export function getFileTypeDetails(fileName: string, mimeType?: string): FileTypeDetails {
  const ext = fileName?.split('.').pop()?.toLowerCase() || '';

  if (ext === 'pdf' || mimeType === 'application/pdf') {
    return {
      extension: 'PDF',
      kind: 'pdf',
      badge: 'PDF',
      color: '#DC2626', // Red
      bg: 'bg-red-50 dark:bg-red-900/40 border-red-100',
    };
  }

  if (
    ext === 'doc' ||
    ext === 'docx' ||
    mimeType?.includes('wordprocessingml') ||
    mimeType?.includes('msword')
  ) {
    return {
      extension: ext.toUpperCase() || 'DOCX',
      kind: 'doc',
      badge: ext.toUpperCase() || 'DOCX',
      color: '#2563EB', // Blue
      bg: 'bg-blue-50 dark:bg-blue-900/40 border-blue-100',
    };
  }

  if (
    ext === 'xls' ||
    ext === 'xlsx' ||
    ext === 'csv' ||
    mimeType?.includes('spreadsheet') ||
    mimeType?.includes('ms-excel')
  ) {
    return {
      extension: ext.toUpperCase() || 'XLSX',
      kind: 'sheet',
      badge: ext.toUpperCase() || 'XLSX',
      color: '#16A34A', // Green
      bg: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-100',
    };
  }

  if (
    ext === 'ppt' ||
    ext === 'pptx' ||
    mimeType?.includes('presentationml') ||
    mimeType?.includes('ms-powerpoint')
  ) {
    return {
      extension: ext.toUpperCase() || 'PPTX',
      kind: 'slide',
      badge: ext.toUpperCase() || 'PPTX',
      color: '#EA580C', // Orange
      bg: 'bg-orange-50 border-orange-100',
    };
  }

  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) || mimeType?.startsWith('image/')) {
    return {
      extension: ext.toUpperCase() || 'IMG',
      kind: 'image',
      badge: ext.toUpperCase() || 'IMG',
      color: '#9333EA', // Purple
      bg: 'bg-purple-50 border-purple-100',
    };
  }

  if (ext === 'txt' || mimeType === 'text/plain') {
    return {
      extension: 'TXT',
      kind: 'text',
      badge: 'TXT',
      color: '#4B5563', // Gray
      bg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800',
    };
  }

  return {
    extension: ext.toUpperCase() || 'FILE',
    kind: 'other',
    badge: ext.toUpperCase() || 'FILE',
    color: '#4B5563',
    bg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800',
  };
}

/**
 * Derives a clean default document title from a filename (strips extension, converts underscores/dashes to title case).
 */
export function deriveDefaultDocumentName(fileName: string): string {
  if (!fileName) return '';
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  const clean = nameWithoutExt.replace(/[-_]+/g, ' ').trim();
  // Capitalize first letters
  return clean
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
