/**
 * iLogMo - SettingsRow Component
 * Accessible, standardized settings list item with icon, label, subtitle, right value, and chevron.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export interface SettingsRowProps {
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconBorderColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  isDestructive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  accessibilityLabel?: string;
}

export function SettingsRow({
  icon,
  iconBgColor = 'bg-neutral-50 dark:bg-neutral-900',
  iconBorderColor = 'border-neutral-100 dark:border-neutral-800',
  title,
  subtitle,
  value,
  rightElement,
  showChevron = true,
  onPress,
  isDestructive = false,
  isFirst = false,
  isLast = false,
  accessibilityLabel,
}: SettingsRowProps) {
  const isPressable = !!onPress;

  const content = (
    <View
      className={`flex-row items-center justify-between px-4 py-3.5 min-h-[52px] ${
        !isLast ? 'border-b border-neutral-100 dark:border-neutral-800' : ''
      }`}
    >
      {/* Left: Icon + Label/Subtitle */}
      <View className="flex-row items-center flex-1 mr-3">
        {icon ? (
          <View
            className={`w-9 h-9 rounded-xl ${iconBgColor} dark:bg-opacity-20 items-center justify-center mr-3.5 border ${iconBorderColor} dark:border-opacity-30`}
          >
            {icon}
          </View>
        ) : null}

        <View className="flex-1">
          <Text
            className={`text-sm font-semibold font-sans ${
              isDestructive ? 'text-red-600 dark:text-red-400' : 'text-neutral-800 dark:text-neutral-200'
            }`}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-xs font-sans text-neutral-400 dark:text-neutral-500 dark:text-neutral-400 mt-0.5" numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Right: Value or Custom Element or Chevron */}
      <View className="flex-row items-center">
        {value ? (
          <Text className="text-xs font-medium font-sans text-neutral-500 dark:text-neutral-400 mr-1.5" numberOfLines={1}>
            {value}
          </Text>
        ) : null}

        {rightElement}

        {showChevron && isPressable ? (
          <ChevronRight size={16} color={colors.neutral[400]} />
        ) : null}
      </View>
    </View>
  );

  if (isPressable) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${title}${subtitle ? `. ${subtitle}` : ''}`}
        style={{ minHeight: 48 }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel || `${title}${subtitle ? `. ${subtitle}` : ''}`}
      style={{ minHeight: 48 }}
    >
      {content}
    </View>
  );
}

export default SettingsRow;
