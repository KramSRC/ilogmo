import React from 'react';
import { View, Text } from 'react-native';
import { BookOpen } from 'lucide-react-native';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
  horizontal?: boolean;
}

export function Logo({
  size = 'md',
  showSubtitle = true,
  subtitle = 'OJT made simple.',
  horizontal = false,
}: LogoProps) {
  let iconContainerSize = 'w-14 h-14 rounded-2xl';
  let iconSize = 26;
  let titleSize = 'text-2xl';
  let subSize = 'text-sm';

  if (size === 'sm') {
    iconContainerSize = 'w-10 h-10 rounded-xl';
    iconSize = 18;
    titleSize = 'text-lg';
    subSize = 'text-xs';
  } else if (size === 'lg') {
    iconContainerSize = 'w-20 h-20 rounded-3xl';
    iconSize = 38;
    titleSize = 'text-3xl';
    subSize = 'text-base';
  }

  if (horizontal) {
    return (
      <View className="flex-row items-center">
        <View
          className={`${iconContainerSize} bg-primary-600 items-center justify-center shadow-soft-md mr-3`}
        >
          <BookOpen size={iconSize} color="#FFFFFF" strokeWidth={2.4} />
        </View>
        <View>
          <Text className={`font-bold font-sans text-neutral-900 ${titleSize}`}>
            iLog<Text className="text-primary-600">Mo</Text>
          </Text>
          {showSubtitle ? (
            <Text className={`font-sans text-neutral-500 ${subSize}`}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View className="items-center justify-center">
      <View
        className={`${iconContainerSize} bg-primary-600 items-center justify-center shadow-soft-md mb-3`}
      >
        <BookOpen size={iconSize} color="#FFFFFF" strokeWidth={2.4} />
      </View>
      <Text className={`font-bold font-sans text-neutral-900 tracking-tight ${titleSize}`}>
        iLog<Text className="text-primary-600">Mo</Text>
      </Text>
      {showSubtitle ? (
        <Text className={`mt-1 font-sans text-neutral-500 ${subSize}`}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

export default Logo;
