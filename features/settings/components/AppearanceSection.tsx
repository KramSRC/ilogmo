/**
 * iLogMo - AppearanceSection Component
 * Segmented radio-style theme selector supporting System, Light, and Dark modes.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Smartphone, Sun, Moon, Check } from 'lucide-react-native';
import { ThemeMode } from '../types';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

export interface AppearanceSectionProps {
  themeMode: ThemeMode;
  onSelectTheme: (mode: ThemeMode) => void;
}

const THEME_OPTIONS: {
  id: ThemeMode;
  label: string;
  subtitle: string;
  icon: (color: string) => React.ReactNode;
}[] = [
  {
    id: 'system',
    label: 'System',
    subtitle: 'Match device setting',
    icon: (color) => <Smartphone size={18} color={color} />,
  },
  {
    id: 'light',
    label: 'Light',
    subtitle: 'Bright appearance',
    icon: (color) => <Sun size={18} color={color} />,
  },
  {
    id: 'dark',
    label: 'Dark',
    subtitle: 'Dim appearance',
    icon: (color) => <Moon size={18} color={color} />,
  },
];

export function AppearanceSection({ themeMode, onSelectTheme }: AppearanceSectionProps) {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <View className="p-4">
      <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-1">
        Theme
      </Text>
      <Text className="text-xs font-sans text-neutral-400 dark:text-neutral-400 mb-3.5">
        Choose how iLogMo looks on your device
      </Text>

      {/* Segmented Selector Grid */}
      <View className="flex-row justify-between space-x-2">
        {THEME_OPTIONS.map((opt) => {
          const isSelected = themeMode === opt.id;
          const activeColor = isSelected
            ? colors.primary[600]
            : isDark
              ? colors.neutral[400]
              : colors.neutral[500];

          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onSelectTheme(opt.id)}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Theme option ${opt.label}. ${opt.subtitle}`}
              style={[
                { minHeight: 74 },
                isSelected && {
                  backgroundColor: isDark
                    ? 'rgba(37, 99, 235, 0.18)'
                    : 'rgba(239, 246, 255, 0.7)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 2,
                  elevation: 1,
                },
              ]}
              className={`flex-1 mx-1 p-3 rounded-2xl items-center justify-center border ${
                isSelected
                  ? 'border-primary-500'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <View className="mb-1.5">{opt.icon(activeColor)}</View>

              <Text
                className={`text-xs font-bold font-sans ${
                  isSelected
                    ? 'text-primary-700 dark:text-primary-400'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
                numberOfLines={1}
              >
                {opt.label}
              </Text>

              <View className="mt-1">
                {isSelected ? (
                  <View className="w-4 h-4 rounded-full bg-primary-600 items-center justify-center">
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  </View>
                ) : (
                  <View className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default AppearanceSection;
