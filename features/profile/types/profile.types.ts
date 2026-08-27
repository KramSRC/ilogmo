/**
 * iLogMo - Profile Domain Types
 */

export interface Profile {
  id: string; // User UUID
  firstName: string;
  lastName: string;
  email: string;
  studentId?: string | null;
  contactNumber?: string | null;
  username?: string | null;
  avatarPath?: string | null;
  avatarUrl?: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  contactNumber?: string;
  username?: string;
}

export interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileActionResult<T = Profile> {
  success: boolean;
  data?: T;
  error?: string;
}
