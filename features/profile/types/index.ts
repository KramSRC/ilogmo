/**
 * Profile & Internship Settings Domain Types
 */

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  studentIdNumber?: string;
  courseAndDepartment?: string;
  university?: string;
  companyName: string;
  supervisorName?: string;
  supervisorEmail?: string;
  totalRequiredOjtHours: number;
  startDate: string; // ISO date
  targetEndDate?: string; // ISO date
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
