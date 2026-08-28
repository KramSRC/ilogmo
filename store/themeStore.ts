/**
 * iLogMo - Global Theme Store (Zustand)
 * Manages theme selection (System, Light, Dark), synchronizes with NativeWind colorScheme,
 * and persists user preference in AsyncStorage.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import { colorScheme } from 'nativewind';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeState {
  themeMode: ThemeMode;
  isDark: boolean;
  isLoaded: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  initTheme: () => Promise<void>;
  syncSystemTheme: (systemScheme: ColorSchemeName) => void;
}

export const THEME_STORAGE_KEY = '@ilogmo_theme_preference';

/**
 * Helper to compute whether dark styling should be applied.
 */
function resolveIsDark(mode: ThemeMode, systemScheme?: ColorSchemeName): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  const current = systemScheme ?? Appearance.getColorScheme();
  return current === 'dark';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'system',
  isDark: resolveIsDark('system'),
  isLoaded: false,

  initTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const mode =
        saved === 'system' || saved === 'light' || saved === 'dark'
          ? (saved as ThemeMode)
          : 'system';

      const isDark = resolveIsDark(mode);

      // Apply to NativeWind
      colorScheme.set(mode);

      set({
        themeMode: mode,
        isDark,
        isLoaded: true,
      });
    } catch (err) {
      console.warn('[useThemeStore.initTheme] Error loading saved theme:', err);
      set({ isLoaded: true });
    }
  },

  setThemeMode: async (mode: ThemeMode) => {
    const isDark = resolveIsDark(mode);

    // Apply immediately to NativeWind
    colorScheme.set(mode);

    set({
      themeMode: mode,
      isDark,
    });

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (err) {
      console.warn('[useThemeStore.setThemeMode] Error saving theme:', err);
    }
  },

  syncSystemTheme: (systemScheme: ColorSchemeName) => {
    const { themeMode } = get();
    if (themeMode === 'system') {
      const isDark = resolveIsDark('system', systemScheme);
      set({ isDark });
    }
  },
}));

export default useThemeStore;
