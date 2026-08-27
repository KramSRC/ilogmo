/**
 * iLogMo - Authentication Zustand Store
 * Manages client-side session, user, and profile state.
 */

import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/features/auth/types';

export interface AuthStoreState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
    }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setProfile: (profile) =>
    set({
      profile,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  logout: () =>
    set({
      user: null,
      session: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));

export default useAuthStore;
