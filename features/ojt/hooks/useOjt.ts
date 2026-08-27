/**
 * iLogMo - useOjt Hook
 * Connects OJT setup and records with Zustand store and Supabase.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOjtStore } from '@/store/ojtStore';
import { ojtService } from '../services/ojtService';
import { OjtFormData, OjtActionResult, OjtRecord } from '../types';

export function useOjt() {
  const { user } = useAuth();
  const {
    activeOjt,
    hasCompletedSetup,
    isLoading: storeLoading,
    setActiveOjt,
    setLoading: setStoreLoading,
  } = useOjtStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!user?.id) {
        setStoreLoading(false);
        return;
      }

      setStoreLoading(true);
      setError(null);
      try {
        const record = await ojtService.getActiveOjt(user.id);
        if (isMounted) {
          setActiveOjt(record);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useOjt] Load error:', err);
          setError('Unable to load your OJT information.');
        }
      } finally {
        if (isMounted) {
          setStoreLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user, setActiveOjt, setStoreLoading]);

  const refresh = useCallback(async () => {
    if (!user?.id) return null;

    setStoreLoading(true);
    setError(null);
    try {
      const record = await ojtService.getActiveOjt(user.id);
      setActiveOjt(record);
      return record;
    } catch (err) {
      console.warn('[useOjt] Refresh error:', err);
      setError('Unable to load your OJT information.');
      return null;
    } finally {
      setStoreLoading(false);
    }
  }, [user, setActiveOjt, setStoreLoading]);

  const createOjt = async (formData: OjtFormData): Promise<OjtActionResult<OjtRecord>> => {
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated.' };
    }

    setIsSubmitting(true);
    setError(null);

    const result = await ojtService.createOjtRecord(user.id, formData);
    setIsSubmitting(false);

    if (result.success && result.data) {
      setActiveOjt(result.data);
    } else {
      setError(result.error || 'Failed to save OJT setup.');
    }

    return result;
  };

  const updateOjt = async (
    recordId: string,
    formData: Partial<OjtFormData>
  ): Promise<OjtActionResult<OjtRecord>> => {
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated.' };
    }

    setIsSubmitting(true);
    setError(null);

    const result = await ojtService.updateOjtRecord(user.id, recordId, formData);
    setIsSubmitting(false);

    if (result.success && result.data) {
      setActiveOjt(result.data);
    } else {
      setError(result.error || 'Failed to update OJT record.');
    }

    return result;
  };

  return {
    activeOjt,
    hasCompletedSetup,
    isLoading: storeLoading,
    isSubmitting,
    error,
    refresh,
    createOjt,
    updateOjt,
  };
}

export default useOjt;
