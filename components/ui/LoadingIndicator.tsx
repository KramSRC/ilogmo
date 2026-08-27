import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '@/constants/colors';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
}

export function LoadingIndicator({
  size = 'large',
  color = colors.primary[600],
  message,
  fullScreen = false,
}: LoadingIndicatorProps) {
  const content = (
    <View className="items-center justify-center py-6">
      <ActivityIndicator size={size} color={color} />
      {message ? <Text className="mt-3 text-sm font-sans text-neutral-500">{message}</Text> : null}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-background-app px-6">{content}</View>
    );
  }

  return content;
}

export default LoadingIndicator;
