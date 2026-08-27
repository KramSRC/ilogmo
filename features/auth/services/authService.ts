/**
 * iLogMo - Authentication Service
 * Wraps Supabase Auth API and profiles database interactions with friendly error handling.
 */

import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import {
  SignInCredentials,
  SignUpCredentials,
  UserProfile,
  AuthActionResult,
} from '@/features/auth/types';
import { Session, User } from '@supabase/supabase-js';

/**
 * Maps raw Supabase / network errors to user-friendly messages.
 */
export function mapAuthError(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message).toLowerCase()
      : String(error).toLowerCase();

  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
    return 'Email or password is incorrect.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please verify your email before signing in.';
  }
  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'An account with this email already exists.';
  }
  if (
    message.includes('network') ||
    message.includes('fetch failed') ||
    message.includes('failed to fetch') ||
    message.includes('network request failed')
  ) {
    return 'Unable to connect. Please check your internet connection.';
  }
  if (
    message.includes('password should be at least') ||
    message.includes('password is too short')
  ) {
    return 'Password must be at least 8 characters.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Please try again in a few minutes.';
  }
  if (message.includes('auth session missing') || message.includes('invalid recovery token')) {
    return 'Your reset session is invalid or has expired. Please request a new reset link.';
  }

  return 'Something went wrong. Please try again.';
}

export const authService = {
  /**
   * Fetch initial session on app startup.
   */
  async getInitialSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('[authService.getInitialSession] Error fetching session:', error.message);
        return null;
      }
      return data.session;
    } catch (err) {
      console.warn('[authService.getInitialSession] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Fetch the user's profile from the profiles table.
   */
  async fetchProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[authService.fetchProfile] Error fetching profile:', error.message);
        return null;
      }
      return data as UserProfile | null;
    } catch (err) {
      console.warn('[authService.fetchProfile] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Ensure user's profile exists in the profiles table, creating it from user_metadata if needed.
   */
  async ensureProfile(user: User): Promise<UserProfile | null> {
    try {
      let profile = await this.fetchProfile(user.id);
      if (!profile) {
        const metadata = user.user_metadata || {};
        const firstName = metadata.first_name || '';
        const lastName = metadata.last_name || '';
        const studentId = metadata.student_id || null;
        const email = user.email || '';

        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            student_id: studentId,
            email: email,
            updated_at: new Date().toISOString(),
          })
          .select('*')
          .maybeSingle();

        if (error) {
          console.warn('[authService.ensureProfile] Profile upsert warning:', error.message);
        } else if (data) {
          profile = data as UserProfile;
        }
      }
      return profile;
    } catch (err) {
      console.warn('[authService.ensureProfile] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Sign in with Email and Password.
   */
  async signIn(
    credentials: SignInCredentials
  ): Promise<AuthActionResult<{ user: User; session: Session }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: 'Unable to sign in. Please check your credentials.',
        };
      }

      // Ensure profile exists in database
      await this.ensureProfile(data.user);

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: mapAuthError(err),
      };
    }
  },

  /**
   * Sign up with Email, Password, and Profile details.
   */
  async signUp(
    credentials: SignUpCredentials
  ): Promise<AuthActionResult<{ user: User | null; session: Session | null }>> {
    try {
      const normalizedEmail = credentials.email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName.trim(),
            last_name: credentials.lastName.trim(),
            student_id: credentials.studentId.trim(),
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      const user = data.user;
      if (user) {
        // Create or update profile in profiles table
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            first_name: credentials.firstName.trim(),
            last_name: credentials.lastName.trim(),
            student_id: credentials.studentId.trim(),
            email: normalizedEmail,
            updated_at: new Date().toISOString(),
          });
        } catch (profileError) {
          console.warn('[authService.signUp] Note: Profile creation fallback:', profileError);
        }
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: mapAuthError(err),
      };
    }
  },

  /**
   * Send Password Reset Email.
   */
  async sendPasswordResetEmail(email: string): Promise<AuthActionResult> {
    try {
      const redirectUrl = Linking.createURL('/(auth)/reset-password');
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: mapAuthError(err),
      };
    }
  },

  /**
   * Update the user's password.
   */
  async updatePassword(newPassword: string): Promise<AuthActionResult> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: mapAuthError(err),
      };
    }
  },

  /**
   * Sign Out.
   */
  async signOut(): Promise<AuthActionResult> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return {
          success: false,
          error: mapAuthError(error),
        };
      }
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: mapAuthError(err),
      };
    }
  },
};

export default authService;
