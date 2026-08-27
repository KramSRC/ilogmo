/**
 * iLogMo - useAuth Hook
 * Exposes authentication state and actions connected with Zustand and authService.
 */

import { useCallback, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/features/auth/services/authService';
import { SignInCredentials, SignUpCredentials, AuthActionResult } from '@/features/auth/types';

export function useAuth() {
  const {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    setSession,
    setUser,
    setProfile,
    setLoading,
    logout: clearStore,
  } = useAuthStore();

  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Refreshes the user's profile from the database.
   */
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return null;
    const userProfile = await authService.fetchProfile(user.id);
    if (userProfile) {
      setProfile(userProfile);
    }
    return userProfile;
  }, [user, setProfile]);

  /**
   * Sign in with email and password.
   */
  const login = useCallback(
    async (credentials: SignInCredentials): Promise<AuthActionResult> => {
      setActionLoading(true);
      try {
        const result = await authService.signIn(credentials);
        if (result.success && result.data) {
          setSession(result.data.session);
          setUser(result.data.user);
          // Fetch profile asynchronously
          authService.fetchProfile(result.data.user.id).then((p) => {
            if (p) setProfile(p);
          });
        }
        return {
          success: result.success,
          error: result.error,
        };
      } finally {
        setActionLoading(false);
      }
    },
    [setSession, setUser, setProfile]
  );

  /**
   * Sign up with registration details.
   */
  const signup = useCallback(
    async (credentials: SignUpCredentials): Promise<AuthActionResult> => {
      setActionLoading(true);
      try {
        const result = await authService.signUp(credentials);
        if (result.success && result.data?.session) {
          setSession(result.data.session);
          setUser(result.data.user);
          if (result.data.user) {
            authService.fetchProfile(result.data.user.id).then((p) => {
              if (p) setProfile(p);
            });
          }
        }
        return {
          success: result.success,
          error: result.error,
        };
      } finally {
        setActionLoading(false);
      }
    },
    [setSession, setUser, setProfile]
  );

  /**
   * Send password reset email.
   */
  const requestPasswordReset = useCallback(async (email: string): Promise<AuthActionResult> => {
    setActionLoading(true);
    try {
      return await authService.sendPasswordResetEmail(email);
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * Update password for user.
   */
  const resetPassword = useCallback(async (newPassword: string): Promise<AuthActionResult> => {
    setActionLoading(true);
    try {
      return await authService.updatePassword(newPassword);
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * Sign out and clear local state.
   */
  const logout = useCallback(async (): Promise<AuthActionResult> => {
    setActionLoading(true);
    try {
      const result = await authService.signOut();
      clearStore();
      return result;
    } finally {
      setActionLoading(false);
    }
  }, [clearStore]);

  return {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    isSubmitting: actionLoading,
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
    refreshProfile,
    setLoading,
    setSession,
    setProfile,
  };
}

export default useAuth;
