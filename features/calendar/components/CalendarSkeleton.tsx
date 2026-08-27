import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function CalendarSkeleton() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.9, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const dummyDays = Array.from({ length: 35 });

  return (
    <Animated.View style={animatedStyle} className="w-full">
      {/* Month Navigator Skeleton */}
      <View className="flex-row justify-between items-center py-2 mb-2">
        <View className="w-11 h-11 bg-neutral-200 rounded-xl" />
        <View className="w-36 h-6 bg-neutral-200 rounded-lg" />
        <View className="w-11 h-11 bg-neutral-200 rounded-xl" />
      </View>

      {/* Calendar Grid Card Skeleton */}
      <View className="bg-white rounded-card p-4 shadow-card border border-neutral-200 mb-4">
        {/* Days Header */}
        <View className="flex-row justify-between mb-3 pb-2 border-b border-neutral-100">
          {Array.from({ length: 7 }).map((_, i) => (
            <View key={i} className="flex-1 items-center">
              <View className="w-7 h-3 bg-neutral-200 rounded" />
            </View>
          ))}
        </View>

        {/* Days Grid */}
        <View className="flex-row flex-wrap">
          {dummyDays.map((_, i) => (
            <View
              key={i}
              style={{ width: `${100 / 7}%`, minHeight: 48 }}
              className="items-center justify-center py-1"
            >
              <View className="w-9 h-9 bg-neutral-100 rounded-full" />
              <View className="w-1.5 h-1.5 bg-neutral-200 rounded-full mt-1" />
            </View>
          ))}
        </View>
      </View>

      {/* Legend Skeleton */}
      <View className="bg-white rounded-card px-4 py-3 shadow-card border border-neutral-200 mb-5 flex-row justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} className="w-16 h-4 bg-neutral-100 rounded" />
        ))}
      </View>

      {/* Selected Date Card Skeleton */}
      <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-5">
        <View className="flex-row justify-between mb-4 pb-3 border-b border-neutral-100">
          <View className="w-32 h-5 bg-neutral-200 rounded" />
          <View className="w-20 h-5 bg-neutral-200 rounded-full" />
        </View>
        <View className="w-full h-16 bg-neutral-100 rounded-2xl mb-3" />
        <View className="w-full h-10 bg-neutral-200 rounded-xl" />
      </View>
    </Animated.View>
  );
}

export default CalendarSkeleton;
