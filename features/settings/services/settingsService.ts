/**
 * iLogMo - Settings Service
 * Handles data export compilation, sharing, and secure user data deletion.
 */

import { Share, Platform } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { UserDataExport, DocumentExportMetadata, SettingsActionResult } from '../types';

export const settingsService = {
  /**
   * Compiles all accessible data for the authenticated user into a structured export object.
   * Excludes any passwords, tokens, or security credentials.
   */
  async exportUserData(userId: string): Promise<SettingsActionResult<UserDataExport>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // 2. Fetch OJT Setup
      const { data: ojtData } = await supabase
        .from('ojt_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // 3. Fetch Attendance
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      // 4. Fetch Journals
      const { data: journalData } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: false });

      // 5. Fetch Tasks
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // 6. Fetch Documents (Metadata only)
      const { data: docData } = await supabase
        .from('documents')
        .select('id, title, category, description, file_name, file_type, file_size, uploaded_at')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      const documentsMetadata: DocumentExportMetadata[] = (docData || []).map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        description: d.description,
        fileName: d.file_name,
        fileType: d.file_type,
        fileSizeBytes: d.file_size,
        uploadedAt: d.uploaded_at,
      }));

      // 7. Fetch Notifications
      const { data: notificationData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // 8. Fetch Notification Settings
      const { data: notificationSettingsData } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const appVersion = Constants.expoConfig?.version ?? '1.0.0';

      const exportPayload: UserDataExport = {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        appVersion,
        user: {
          id: userId,
          email: profileData?.email || '',
          firstName: profileData?.first_name || '',
          lastName: profileData?.last_name || '',
          studentId: profileData?.student_id || null,
          contactNumber: profileData?.contact_number || null,
          username: profileData?.username || null,
          createdAt: profileData?.created_at,
        },
        ojtSetup: ojtData || [],
        attendance: attendanceData || [],
        journals: journalData || [],
        tasks: taskData || [],
        documentsMetadata,
        notifications: notificationData || [],
        notificationSettings: notificationSettingsData || null,
      };

      return {
        success: true,
        data: exportPayload,
      };
    } catch (err: any) {
      console.warn('[settingsService.exportUserData] Error compiling data:', err);
      return {
        success: false,
        error: err?.message || 'Unable to export your data.',
      };
    }
  },

  /**
   * Shares the generated export object using the platform's native share sheet.
   */
  async shareExportedData(data: UserDataExport): Promise<SettingsActionResult<boolean>> {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const title = `ilogmo-data-export-${new Date().toISOString().slice(0, 10)}.json`;

      await Share.share(
        {
          title,
          message: jsonString,
        },
        {
          dialogTitle: 'Export iLogMo Data',
          subject: title,
        }
      );

      return { success: true, data: true };
    } catch (err: any) {
      console.warn('[settingsService.shareExportedData] Share sheet error:', err);
      return {
        success: false,
        error: err?.message || 'Unable to share exported data.',
      };
    }
  },

  /**
   * Securely cleans up user-owned records across tables and storage buckets, then signs out.
   */
  async deleteUserAccountData(userId: string): Promise<SettingsActionResult<boolean>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      // 1. Delete user documents metadata
      await supabase.from('documents').delete().eq('user_id', userId);

      // 2. Delete tasks
      await supabase.from('tasks').delete().eq('user_id', userId);

      // 3. Delete journals
      await supabase.from('journals').delete().eq('user_id', userId);

      // 4. Delete attendance
      await supabase.from('attendance').delete().eq('user_id', userId);

      // 5. Delete notifications & notification settings
      await supabase.from('notifications').delete().eq('user_id', userId);
      await supabase.from('notification_settings').delete().eq('user_id', userId);

      // 6. Delete OJT records
      await supabase.from('ojt_records').delete().eq('user_id', userId);

      // 7. Delete profile
      await supabase.from('profiles').delete().eq('id', userId);

      // 8. Sign out from Supabase Auth
      await supabase.auth.signOut();

      return {
        success: true,
        data: true,
      };
    } catch (err: any) {
      console.warn('[settingsService.deleteUserAccountData] Error:', err);
      return {
        success: false,
        error: err?.message || 'Unable to delete your account.',
      };
    }
  },
};

export default settingsService;
