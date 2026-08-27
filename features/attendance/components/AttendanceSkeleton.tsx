import React from 'react';
import { View } from 'react-native';

export function AttendanceSkeleton() {
  return (
    <View className="flex-1 px-5 pt-4">
      {/* Header Skeleton */}
      <View className="flex-row justify-between items-center mb-5">
        <View>
          <View className="w-36 h-7 bg-neutral-200 rounded-lg mb-1.5" />
          <View className="w-56 h-4 bg-neutral-200 rounded-md" />
        </View>
        <View className="w-11 h-11 bg-neutral-200 rounded-2xl" />
      </View>

      {/* Main Today Card Skeleton */}
      <View className="w-full h-72 bg-neutral-200 rounded-card mb-5 p-5 justify-between">
        <View className="flex-row justify-between">
          <View className="w-32 h-4 bg-neutral-300 rounded" />
          <View className="w-20 h-4 bg-neutral-300 rounded-full" />
        </View>
        <View className="w-full h-16 bg-neutral-300 rounded-xl" />
        <View className="items-center">
          <View className="w-28 h-8 bg-neutral-300 rounded-lg mb-1" />
          <View className="w-20 h-3 bg-neutral-300 rounded" />
        </View>
        <View className="w-full h-11 bg-neutral-300 rounded-xl" />
      </View>

      {/* Weekly Overview Skeleton */}
      <View className="w-full h-24 bg-neutral-200 rounded-card mb-5" />

      {/* History Skeleton */}
      <View className="w-full h-36 bg-neutral-200 rounded-card" />
    </View>
  );
}

export default AttendanceSkeleton;
