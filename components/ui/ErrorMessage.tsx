import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

export interface ErrorMessageProps {
  message?: string | null;
  type?: AlertType;
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({
  message,
  type = 'error',
  title,
  onDismiss,
  className = '',
}: ErrorMessageProps) {
  if (!message) return null;

  let bgClass = 'bg-red-50 border-red-200';
  let textClass = 'text-red-800';
  let titleClass = 'text-red-900';
  let IconComponent = AlertCircle;
  let iconColor: string = colors.error.DEFAULT;

  if (type === 'success') {
    bgClass = 'bg-emerald-50 border-emerald-200';
    textClass = 'text-emerald-800';
    titleClass = 'text-emerald-900';
    IconComponent = CheckCircle2;
    iconColor = colors.success.DEFAULT;
  } else if (type === 'warning') {
    bgClass = 'bg-amber-50 border-amber-200';
    textClass = 'text-amber-800';
    titleClass = 'text-amber-900';
    IconComponent = AlertCircle;
    iconColor = colors.warning.DEFAULT;
  } else if (type === 'info') {
    bgClass = 'bg-blue-50 border-blue-200';
    textClass = 'text-blue-800';
    titleClass = 'text-blue-900';
    IconComponent = Info;
    iconColor = colors.primary[600];
  }

  return (
    <View
      accessibilityRole="alert"
      className={`flex-row items-start p-3.5 rounded-2xl border ${bgClass} ${className}`}
    >
      <View className="mr-2.5 mt-0.5">
        <IconComponent size={18} color={iconColor} />
      </View>

      <View className="flex-1">
        {title ? (
          <Text className={`text-sm font-semibold font-sans mb-0.5 ${titleClass}`}>{title}</Text>
        ) : null}
        <Text className={`text-sm font-sans leading-5 ${textClass}`}>{message}</Text>
      </View>

      {onDismiss ? (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="ml-2 p-0.5"
        >
          <X size={16} color={colors.neutral[400]} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default ErrorMessage;
