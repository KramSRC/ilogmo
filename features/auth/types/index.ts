/**
 * iLogMo - Authentication & Profile Domain Types
 */

import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  student_id: string | null;
  email: string;
  contact_number?: string | null;
  username?: string | null;
  avatar_path?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  password: string;
}

export interface ResetPasswordCredentials {
  password: string;
}

export interface AuthActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
