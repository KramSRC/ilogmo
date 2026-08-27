/**
 * iLogMo - useTheme Hook
 * Manages theme selection (System, Light, Dark) and persists preference to AsyncStorage.
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme, useColorScheme } from 'nativewind';
import { ThemeMode } from '../types';

const THEME_STORAGE_KEY = '@ilogmo_theme_preference';

export function useTheme() {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { colorScheme: activeScheme } = useColorScheme();

  // Load saved preference on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTheme() {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && (saved === 'system' || saved === 'light' || saved === 'dark')) {
          if (isMounted) {
            setThemeModeState(saved as ThemeMode);
            colorScheme.set(saved as ThemeMode);
          }
        } else {
          // Default to system
          colorScheme.set('system');
        }
      } catch (err) {
        console.warn('[useTheme] Error loading theme preference:', err);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    loadTheme();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update theme mode and persist locally
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      colorScheme.set(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (err) {
      console.warn('[useTheme] Error saving theme preference:', err);
    }
  }, []);

  return {
    themeMode,
    activeScheme,
    isLoaded,
    setThemeMode,
  };
}

export default useTheme;
