/**
 * iLogMo - OJT Feature Domain Types
 */

export type WorkingDay =
  'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface OjtRecord {
  id: string;
  userId: string;
  companyName: string;
  department: string;
  supervisorName?: string | null;
  companyAddress?: string | null;
  requiredHours: number;
  startDate: string; // ISO date YYYY-MM-DD
  expectedEndDate?: string | null; // ISO date YYYY-MM-DD
  workingDays: WorkingDay[];
  expectedStartTime?: string | null; // "08:00"
  expectedEndTime?: string | null; // "17:00"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OjtFormData {
  requiredHours: number;
  startDate: string;
  expectedEndDate?: string;
  companyName: string;
  department: string;
  supervisorName?: string;
  companyAddress?: string;
  workingDays: WorkingDay[];
  expectedStartTime?: string;
  expectedEndTime?: string;
}

export interface OjtActionResult<T = OjtRecord> {
  success: boolean;
  data?: T;
  error?: string;
}
