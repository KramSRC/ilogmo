import React from 'react';
import { View } from 'react-native';

export function DashboardSkeleton() {
  return (
    <View className="flex-1 px-5 pt-4">
      {/* Header Skeleton */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <View className="w-48 h-7 bg-neutral-200 rounded-lg mb-2" />
          <View className="w-64 h-4 bg-neutral-200 rounded-md" />
        </View>
        <View className="w-11 h-11 bg-neutral-200 rounded-2xl" />
      </View>

      {/* Progress Card Skeleton */}
      <View className="w-full h-44 bg-neutral-200 rounded-card mb-5 p-5 justify-between">
        <View className="w-32 h-5 bg-neutral-300 rounded" />
        <View className="flex-row justify-between items-center">
          <View className="w-36 h-10 bg-neutral-300 rounded-lg" />
          <View className="w-24 h-24 bg-neutral-300 rounded-full" />
        </View>
        <View className="w-48 h-4 bg-neutral-300 rounded" />
      </View>

      {/* Attendance Card Skeleton */}
      <View className="w-full h-36 bg-neutral-200 rounded-card mb-5 p-5 justify-between">
        <View className="w-40 h-5 bg-neutral-300 rounded" />
        <View className="w-full h-11 bg-neutral-300 rounded-xl" />
      </View>

      {/* Quick Actions Skeleton */}
      <View className="mb-6">
        <View className="w-28 h-5 bg-neutral-200 rounded mb-3" />
        <View className="flex-row space-x-3 mb-3">
          <View className="flex-1 h-28 bg-neutral-200 rounded-card" />
          <View className="w-3" />
          <View className="flex-1 h-28 bg-neutral-200 rounded-card" />
        </View>
      </View>
    </View>
  );
}

export default DashboardSkeleton;
