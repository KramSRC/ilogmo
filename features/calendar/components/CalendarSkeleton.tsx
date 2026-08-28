import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export function CalendarSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const dummyDays = Array.from({ length: 35 });

  return (
    <Animated.View style={{ opacity }} className="w-full">
      {/* Month Navigator Skeleton */}
      <View className="flex-row justify-between items-center py-2 mb-2">
        <View className="w-11 h-11 bg-neutral-200 rounded-xl" />
        <View className="w-36 h-6 bg-neutral-200 rounded-lg" />
        <View className="w-11 h-11 bg-neutral-200 rounded-xl" />
      </View>

      {/* Calendar Grid Card Skeleton */}
      <View className="bg-white dark:bg-neutral-900 rounded-card p-4 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-4">
        {/* Days Header */}
        <View className="flex-row justify-between mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
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
              <View className="w-9 h-9 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
              <View className="w-1.5 h-1.5 bg-neutral-200 rounded-full mt-1" />
            </View>
          ))}
        </View>
      </View>

      {/* Legend Skeleton */}
      <View className="bg-white dark:bg-neutral-900 rounded-card px-4 py-3 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-5 flex-row justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} className="w-16 h-4 bg-neutral-100 dark:bg-neutral-800 rounded" />
        ))}
      </View>

      {/* Selected Date Card Skeleton */}
      <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-5">
        <View className="flex-row justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <View className="w-32 h-5 bg-neutral-200 rounded" />
          <View className="w-20 h-5 bg-neutral-200 rounded-full" />
        </View>
        <View className="w-full h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-3" />
        <View className="w-full h-10 bg-neutral-200 rounded-xl" />
      </View>
    </Animated.View>
  );
}

export default CalendarSkeleton;
