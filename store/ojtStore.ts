/**
 * iLogMo - OJT Zustand Store
 * Global state for active OJT configuration and setup completion status.
 */

import { create } from 'zustand';
import { OjtRecord } from '@/features/ojt/types';

export interface OjtStoreState {
  activeOjt: OjtRecord | null;
  hasCompletedSetup: boolean;
  isLoading: boolean;
  setActiveOjt: (ojt: OjtRecord | null) => void;
  setSetupComplete: (complete: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  clearOjt: () => void;
}

export const useOjtStore = create<OjtStoreState>((set) => ({
  activeOjt: null,
  hasCompletedSetup: false,
  isLoading: true,

  setActiveOjt: (ojt) =>
    set({
      activeOjt: ojt,
      hasCompletedSetup: ojt !== null,
    }),

  setSetupComplete: (hasCompletedSetup) =>
    set({
      hasCompletedSetup,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  clearOjt: () =>
    set({
      activeOjt: null,
      hasCompletedSetup: false,
      isLoading: false,
    }),
}));

export default useOjtStore;
