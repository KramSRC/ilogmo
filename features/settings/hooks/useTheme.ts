/**
 * iLogMo - useTheme Hook
 * Connects to the global Theme Store and NativeWind colorScheme.
 */

import { useThemeStore } from '@/store/themeStore';
import { useColorScheme } from 'nativewind';
import { ThemeMode } from '../types';

export function useTheme() {
  const { themeMode, isDark, isLoaded, setThemeMode } = useThemeStore();
  const { colorScheme: activeScheme } = useColorScheme();

  return {
    themeMode,
    activeScheme,
    isDark,
    isLoaded,
    setThemeMode: (mode: ThemeMode) => setThemeMode(mode),
  };
}

export default useTheme;
