/**
 * iLogMo - ReportSkeleton Component
 * Placeholder skeleton loaders for the Reports screen.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export function ReportSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
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
    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  return (
    <View className="space-y-4">
      {/* 1. Filter tabs skeleton */}
      <Animated.View style={{ opacity }} className="h-11 bg-neutral-200 rounded-2xl mb-4" />

      {/* 2. Progress card skeleton */}
      <Animated.View
        style={{ opacity }}
        className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent mb-4 h-40 justify-between"
      >
        <View className="flex-row justify-between items-center">
          <View className="w-28 h-5 bg-neutral-200 rounded-md" />
          <View className="w-14 h-5 bg-neutral-200 rounded-full" />
        </View>
        <View className="w-48 h-8 bg-neutral-200 rounded-md" />
        <View className="w-full h-3 bg-neutral-200 rounded-full" />
      </Animated.View>

      {/* 3. OJT Summary card skeleton */}
      <Animated.View
        style={{ opacity }}
        className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent mb-4 h-52 justify-between"
      >
        <View className="w-32 h-5 bg-neutral-200 rounded-md" />
        <View className="w-full h-4 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
        <View className="w-full h-4 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
        <View className="w-full h-4 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
        <View className="w-full h-4 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
      </Animated.View>

      {/* 4. Attendance Summary card skeleton */}
      <Animated.View
        style={{ opacity }}
        className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent mb-4 h-48 justify-between"
      >
        <View className="w-36 h-5 bg-neutral-200 rounded-md" />
        <View className="flex-row justify-between">
          <View className="w-[30%] h-14 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
          <View className="w-[30%] h-14 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
          <View className="w-[30%] h-14 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
        </View>
        <View className="flex-row justify-between">
          <View className="w-[30%] h-14 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
          <View className="w-[30%] h-14 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
          <View className="w-[30%] h-14 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
        </View>
      </Animated.View>
    </View>
  );
}

export default ReportSkeleton;
