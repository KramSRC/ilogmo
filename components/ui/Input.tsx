import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerClassName = '',
      className = '',
      onFocus,
      onBlur,
      editable = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    let borderColor = 'border-neutral-200';
    let bgColor = editable ? 'bg-white' : 'bg-neutral-100';

    if (error) {
      borderColor = 'border-red-500';
    } else if (isFocused) {
      borderColor = 'border-primary-600';
    }

    return (
      <View className={`w-full ${containerClassName}`}>
        {label ? (
          <Text className="mb-1.5 text-sm font-medium font-sans text-neutral-800">{label}</Text>
        ) : null}

        <View
          className={`flex-row items-center border rounded-2xl px-3.5 min-h-[50px] shadow-soft-sm ${bgColor} ${borderColor}`}
        >
          {leftIcon ? <View className="mr-2.5">{leftIcon}</View> : null}

          <TextInput
            ref={ref}
            editable={editable}
            placeholderTextColor={colors.neutral[400]}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            className={`flex-1 py-3 text-base font-sans text-neutral-900 ${className}`}
            {...props}
          />

          {rightIcon ? (
            onRightIconPress ? (
              <TouchableOpacity
                onPress={onRightIconPress}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="ml-2.5 p-1"
              >
                {rightIcon}
              </TouchableOpacity>
            ) : (
              <View className="ml-2.5">{rightIcon}</View>
            )
          ) : null}
        </View>

        {error ? (
          <Text className="mt-1.5 text-xs font-sans text-red-500">{error}</Text>
        ) : helperText ? (
          <Text className="mt-1.5 text-xs font-sans text-neutral-500">{helperText}</Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;
