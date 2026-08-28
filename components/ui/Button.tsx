import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/constants/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  // Base container styles
  let variantContainer = 'bg-primary-600 active:bg-primary-700 border border-transparent';
  let variantText = 'text-white font-semibold';
  let indicatorColor = '#FFFFFF';

  if (variant === 'secondary') {
    variantContainer = 'bg-neutral-100 dark:bg-neutral-800 active:bg-neutral-200 border border-transparent';
    variantText = 'text-neutral-900 dark:text-neutral-100 font-semibold';
    indicatorColor = colors.neutral[900];
  } else if (variant === 'outline') {
    variantContainer = 'bg-white dark:bg-neutral-900 active:bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-transparent';
    variantText = 'text-neutral-900 dark:text-neutral-100 font-medium';
    indicatorColor = colors.primary[600];
  } else if (variant === 'ghost') {
    variantContainer = 'bg-transparent active:bg-neutral-100 dark:bg-neutral-800 border border-transparent';
    variantText = 'text-neutral-700 dark:text-neutral-300 font-medium';
    indicatorColor = colors.neutral[700];
  } else if (variant === 'danger') {
    variantContainer = 'bg-red-600 active:bg-red-700 border border-transparent';
    variantText = 'text-white font-semibold';
    indicatorColor = '#FFFFFF';
  }

  // Size styles
  let sizeContainer = 'py-3.5 px-5 min-h-[50px] rounded-button';
  let sizeText = 'text-base';

  if (size === 'sm') {
    sizeContainer = 'py-2 px-3.5 min-h-[44px] rounded-xl';
    sizeText = 'text-sm';
  } else if (size === 'lg') {
    sizeContainer = 'py-4 px-6 min-h-[56px] rounded-2xl';
    sizeText = 'text-lg';
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[{ opacity: isDisabled ? 0.6 : 1 }, style]}
      className={`flex-row items-center justify-center ${variantContainer} ${sizeContainer} ${className}`}
      {...props}
    >
      {isLoading ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator size="small" color={indicatorColor} />
          {loadingText ? (
            <Text className={`ml-2.5 font-sans ${sizeText} ${variantText}`}>{loadingText}</Text>
          ) : (
            <Text className={`ml-2.5 font-sans ${sizeText} ${variantText}`}>{title}</Text>
          )}
        </View>
      ) : (
        <View className="flex-row items-center justify-center">
          {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
          <Text className={`font-sans ${sizeText} ${variantText}`}>{title}</Text>
          {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Button;
