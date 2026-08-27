/**
 * iLogMo - Profile Service
 * Handles Supabase queries for student profiles, avatar storage, username uniqueness, and password updates.
 */

import { supabase } from '@/lib/supabase';
import { Profile, ProfileFormData, ProfileActionResult } from '../types';
import { validateContactNumber, validateUsername } from '../utils/profileUtils';

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Maps raw Supabase row to domain Profile model.
 */
function mapRowToProfile(row: any): Profile {
  return {
    id: row.id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email || '',
    studentId: row.student_id || null,
    contactNumber: row.contact_number || null,
    username: row.username || null,
    avatarPath: row.avatar_path || null,
    avatarUrl: row.avatar_url || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const profileService = {
  /**
   * Fetch profile for a user by user ID.
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[profileService.getProfile] Error:', error.message);
        return null;
      }

      if (!data) return null;

      const profile = mapRowToProfile(data);

      // If avatarPath exists, generate signed URL
      if (profile.avatarPath) {
        const signedUrl = await this.getAvatarSignedUrl(profile.avatarPath);
        if (signedUrl) {
          profile.avatarUrl = signedUrl;
        }
      }

      return profile;
    } catch (err) {
      console.warn('[profileService.getProfile] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Update student profile fields (First Name, Last Name, Contact Number, Username).
   */
  async updateProfile(
    userId: string,
    formData: ProfileFormData
  ): Promise<ProfileActionResult<Profile>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      // 1. Validations
      const cleanFirstName = formData.firstName?.trim();
      const cleanLastName = formData.lastName?.trim();
      const cleanContactNumber = formData.contactNumber?.trim() || null;
      const cleanUsername = formData.username?.trim().toLowerCase() || null;

      if (!cleanFirstName) {
        return { success: false, error: 'First name is required.' };
      }
      if (!cleanLastName) {
        return { success: false, error: 'Last name is required.' };
      }

      if (cleanContactNumber && !validateContactNumber(cleanContactNumber)) {
        return { success: false, error: 'Please enter a valid contact number.' };
      }

      if (cleanUsername) {
        const userCheck = validateUsername(cleanUsername);
        if (!userCheck.valid) {
          return { success: false, error: userCheck.error || 'Invalid username.' };
        }

        // Check username uniqueness
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', cleanUsername)
          .neq('id', userId)
          .maybeSingle();

        if (!checkError && existingUser) {
          return { success: false, error: 'This username is already taken.' };
        }
      }

      // 2. Update Database Record
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: cleanFirstName,
          last_name: cleanLastName,
          contact_number: cleanContactNumber,
          username: cleanUsername,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (updateError) {
        console.warn('[profileService.updateProfile] DB Error:', updateError.message);
        if (
          updateError.message.includes('unique constraint') ||
          updateError.message.includes('username')
        ) {
          return { success: false, error: 'This username is already taken.' };
        }
        return { success: false, error: 'Unable to save your changes.' };
      }

      // 3. Update auth user metadata in background for session consistency
      try {
        await supabase.auth.updateUser({
          data: {
            first_name: cleanFirstName,
            last_name: cleanLastName,
          },
        });
      } catch (authMetaErr) {
        console.warn(
          '[profileService.updateProfile] Metadata update non-fatal error:',
          authMetaErr
        );
      }

      const updatedProfile = mapRowToProfile(data);
      if (updatedProfile.avatarPath) {
        updatedProfile.avatarUrl = await this.getAvatarSignedUrl(updatedProfile.avatarPath);
      }

      return {
        success: true,
        data: updatedProfile,
      };
    } catch (err: any) {
      console.warn('[profileService.updateProfile] Unexpected error:', err);
      return {
        success: false,
        error: err?.message || 'Unable to save your changes. Please try again.',
      };
    }
  },

  /**
   * Upload an avatar image to Supabase Storage and update profile avatar path.
   */
  async uploadAvatar(
    userId: string,
    imageUri: string,
    mimeType: string = 'image/jpeg'
  ): Promise<ProfileActionResult<string>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      // 1. Fetch file binary
      const response = await fetch(imageUri);
      const blob = await response.blob();

      if (blob.size > MAX_AVATAR_SIZE_BYTES) {
        return {
          success: false,
          error: 'Image is too large. Please choose an image smaller than 5 MB.',
        };
      }

      // 2. Storage Path: avatars/{userId}/profile.jpg
      const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
      const storagePath = `${userId}/profile.${ext}`;

      // 3. Upload to avatars bucket
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .upload(storagePath, blob, {
          contentType: mimeType,
          upsert: true,
        });

      if (storageError) {
        console.warn('[profileService.uploadAvatar] Storage Error:', storageError.message);
        return {
          success: false,
          error: 'Unable to update profile photo.',
        };
      }

      // 4. Update avatar_path in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_path: storagePath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.warn('[profileService.uploadAvatar] DB Error:', updateError.message);
      }

      // 5. Generate signed URL for display
      const signedUrl = await this.getAvatarSignedUrl(storagePath);

      return {
        success: true,
        data: signedUrl || storagePath,
      };
    } catch (err: any) {
      console.warn('[profileService.uploadAvatar] Unexpected error:', err);
      return {
        success: false,
        error: err?.message || 'Unable to update profile photo.',
      };
    }
  },

  /**
   * Generate short-lived signed URL for an avatar image.
   */
  async getAvatarSignedUrl(avatarPath: string): Promise<string | null> {
    try {
      if (!avatarPath) return null;

      const { data, error } = await supabase.storage
        .from('avatars')
        .createSignedUrl(avatarPath, 86400); // 24-hour validity

      if (error) {
        console.warn('[profileService.getAvatarSignedUrl] Error:', error.message);
        return null;
      }

      return data?.signedUrl || null;
    } catch (err) {
      console.warn('[profileService.getAvatarSignedUrl] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Update password via Supabase Auth.
   */
  async changePassword(newPassword: string): Promise<ProfileActionResult<boolean>> {
    try {
      if (!newPassword || newPassword.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long.' };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to update password. Please try again.',
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to update password.',
      };
    }
  },
};

export default profileService;
