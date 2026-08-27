/**
 * iLogMo - Settings Types & Interfaces
 */

export type ThemeMode = 'system' | 'light' | 'dark';

export interface DocumentExportMetadata {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

export interface UserDataExport {
  exportDate: string;
  exportVersion: string;
  appVersion: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    studentId?: string | null;
    contactNumber?: string | null;
    username?: string | null;
    createdAt?: string;
  };
  ojtSetup: any | null;
  attendance: any[];
  journals: any[];
  tasks: any[];
  documentsMetadata: DocumentExportMetadata[];
  notifications: any[];
  notificationSettings: any | null;
}

export interface SettingsActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
