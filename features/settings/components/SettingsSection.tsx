/**
 * iLogMo - SettingsSection Component
 * Card container for grouped settings options with optional header title and subtitle.
 */

import React from 'react';
import { View, Text } from 'react-native';

export interface SettingsSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  subtitle,
  children,
  className = '',
}: SettingsSectionProps) {
  return (
    <View className={`mb-5 ${className}`}>
      {title ? (
        <View className="mb-2 px-1">
          <Text className="text-xs font-bold font-sans text-neutral-400 dark:text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</Text>
          ) : null}
        </View>
      ) : null}

      <View className="bg-white dark:bg-neutral-900 rounded-card shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {children}
      </View>
    </View>
  );
}

export default SettingsSection;
