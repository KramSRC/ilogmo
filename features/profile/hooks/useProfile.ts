/**
 * iLogMo - useProfile Hook
 * Provides profile state, avatar upload, edit profile handler, and password change methods.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore, useOjtStore } from '@/store';
import { profileService } from '../services';
import { Profile, ProfileFormData, ProfileActionResult } from '../types';
import { supabase } from '@/lib/supabase';

export function useProfile() {
  const {
    user,
    profile: authProfile,
    setProfile: setAuthProfile,
    logout: authLogout,
  } = useAuthStore();
  const { activeOjt } = useOjtStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    let isMounted = true;

    async function loadInitialProfile() {
      if (!user?.id) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await profileService.getProfile(user.id);
        if (isMounted && data) {
          setProfile(data);
          // Sync with auth store
          setAuthProfile({
            id: data.id,
            first_name: data.firstName,
            last_name: data.lastName,
            student_id: data.studentId || null,
            email: data.email,
            contact_number: data.contactNumber,
            username: data.username,
            avatar_path: data.avatarPath,
            avatar_url: data.avatarUrl,
            created_at: data.createdAt,
            updated_at: data.updatedAt,
          });
        }
      } catch (err: any) {
        console.warn('[useProfile.loadInitialProfile] Error:', err);
        if (isMounted) {
          setError('Unable to load your profile.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialProfile();

    return () => {
      isMounted = false;
    };
  }, [user, setAuthProfile]);

  /**
   * Refresh profile.
   */
  const refresh = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await profileService.getProfile(user.id);
      if (data) {
        setProfile(data);
        setAuthProfile({
          id: data.id,
          first_name: data.firstName,
          last_name: data.lastName,
          student_id: data.studentId || null,
          email: data.email,
          contact_number: data.contactNumber,
          username: data.username,
          avatar_path: data.avatarPath,
          avatar_url: data.avatarUrl,
          created_at: data.createdAt,
          updated_at: data.updatedAt,
        });
      }
    } catch (err) {
      console.warn('[useProfile.refresh] Error refreshing profile:', err);
    }
  }, [user, setAuthProfile]);

  /**
   * Update profile information.
   */
  const updateProfile = useCallback(
    async (formData: ProfileFormData): Promise<ProfileActionResult<Profile>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsSaving(true);
      setError(null);

      try {
        const result = await profileService.updateProfile(user.id, formData);
        if (result.success && result.data) {
          setProfile(result.data);
          setAuthProfile({
            id: result.data.id,
            first_name: result.data.firstName,
            last_name: result.data.lastName,
            student_id: result.data.studentId || null,
            email: result.data.email,
            contact_number: result.data.contactNumber,
            username: result.data.username,
            avatar_path: result.data.avatarPath,
            avatar_url: result.data.avatarUrl,
            created_at: result.data.createdAt,
            updated_at: result.data.updatedAt,
          });
        }
        return result;
      } catch (err: any) {
        console.warn('[useProfile.updateProfile] Error:', err);
        return {
          success: false,
          error: err?.message || 'Unable to save your changes.',
        };
      } finally {
        setIsSaving(false);
      }
    },
    [user, setAuthProfile]
  );

  /**
   * Upload and update avatar image.
   */
  const uploadAvatar = useCallback(
    async (imageUri: string, mimeType?: string): Promise<ProfileActionResult<string>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsUploadingAvatar(true);
      try {
        const result = await profileService.uploadAvatar(user.id, imageUri, mimeType);
        if (result.success && result.data) {
          setProfile((prev) => (prev ? { ...prev, avatarUrl: result.data } : null));
        }
        return result;
      } catch (err: any) {
        console.warn('[useProfile.uploadAvatar] Error:', err);
        return {
          success: false,
          error: err?.message || 'Unable to update profile photo.',
        };
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [user]
  );

  /**
   * Change password via Supabase Auth.
   */
  const changePassword = useCallback(async (newPassword: string) => {
    return await profileService.changePassword(newPassword);
  }, []);

  /**
   * Sign out of Supabase Auth and reset user state.
   */
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[useProfile.logout] Sign out error:', err);
    } finally {
      authLogout();
    }
  }, [authLogout]);

  return {
    user,
    profile:
      profile ||
      (authProfile
        ? {
            id: authProfile.id,
            firstName: authProfile.first_name,
            lastName: authProfile.last_name,
            email: authProfile.email,
            studentId: authProfile.student_id,
            contactNumber: authProfile.contact_number,
            username: authProfile.username,
            avatarPath: authProfile.avatar_path,
            avatarUrl: authProfile.avatar_url,
            createdAt: authProfile.created_at,
            updatedAt: authProfile.updated_at,
          }
        : null),
    ojtRecord: activeOjt,
    isLoading,
    isSaving,
    isUploadingAvatar,
    error,
    refresh,
    updateProfile,
    uploadAvatar,
    changePassword,
    logout,
  };
}

export default useProfile;
