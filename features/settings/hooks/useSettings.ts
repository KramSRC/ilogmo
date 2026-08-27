/**
 * iLogMo - useSettings Hook
 * Central hook for Settings actions (Theme, Data Export, Account Deletion, and Clean Sign-out).
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { useJournalStore } from '@/store/journalStore';
import { useTaskStore } from '@/store/taskStore';
import { useDocumentStore } from '@/store/documentStore';
import { useNotificationStore } from '@/store/notificationStore';
import { settingsService } from '../services/settingsService';
import { useTheme } from './useTheme';
import { UserDataExport } from '../types';

export function useSettings() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const { themeMode, activeScheme, isLoaded: isThemeLoaded, setThemeMode } = useTheme();

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  /**
   * Clears all user-specific local Zustand stores upon logout or deletion.
   * Preserves global preferences like app theme.
   */
  const clearUserLocalState = useCallback(() => {
    useAuthStore.getState().logout();
    useOjtStore.getState().clearOjt();
    useJournalStore.getState().clearEntries();
    useTaskStore.getState().clearTasks();
    useDocumentStore.getState().clearDocuments();
    useNotificationStore.getState().clearNotifications();
  }, []);

  /**
   * Compile and share user data as JSON.
   */
  const exportData = useCallback(async (): Promise<{ success: boolean; data?: UserDataExport; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated.' };
    }

    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);

    try {
      const result = await settingsService.exportUserData(user.id);
      if (result.success && result.data) {
        // Trigger share sheet
        await settingsService.shareExportedData(result.data);
        setExportSuccess(true);
        return { success: true, data: result.data };
      } else {
        const err = result.error || 'Unable to export your data.';
        setExportError(err);
        return { success: false, error: err };
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Unable to export your data.';
      setExportError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsExporting(false);
    }
  }, [user]);

  /**
   * Delete all user-owned data from database and storage, then clear state and sign out.
   */
  const deleteAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated.' };
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await settingsService.deleteUserAccountData(user.id);
      if (result.success) {
        clearUserLocalState();
        return { success: true };
      } else {
        const err = result.error || 'Unable to delete your account.';
        setDeleteError(err);
        return { success: false, error: err };
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Unable to delete your account.';
      setDeleteError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsDeleting(false);
    }
  }, [user, clearUserLocalState]);

  /**
   * Signs out from Supabase and clears all user-specific state.
   */
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[useSettings.logout] Supabase signOut error:', err);
    } finally {
      clearUserLocalState();
    }
  }, [clearUserLocalState]);

  return {
    user,
    profile,
    themeMode,
    activeScheme,
    isThemeLoaded,
    setThemeMode,
    isExporting,
    exportError,
    exportSuccess,
    exportData,
    isDeleting,
    deleteError,
    deleteAccount,
    logout,
  };
}

export default useSettings;
