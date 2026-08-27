/**
 * iLogMo - Global State Management (Zustand)
 * Central export for application-wide stores and hooks.
 */

import { create } from 'zustand';

export interface AppState {
  isInitialized: boolean;
  isOnline: boolean;
  activeFeature: string | null;
  setInitialized: (value: boolean) => void;
  setOnline: (value: boolean) => void;
  setActiveFeature: (feature: string | null) => void;
  resetAppState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  isOnline: true,
  activeFeature: null,
  setInitialized: (value) => set({ isInitialized: value }),
  setOnline: (value) => set({ isOnline: value }),
  setActiveFeature: (feature) => set({ activeFeature: feature }),
  resetAppState: () => set({ isInitialized: false, isOnline: true, activeFeature: null }),
}));

export * from './authStore';
export * from './ojtStore';
export * from './journalStore';
export * from './taskStore';
export * from './documentStore';
export default useAppStore;
