/**
 * iLogMo - Analytics Skeleton Loader
 */

import React from 'react';
import { View } from 'react-native';

export function AnalyticsSkeleton() {
  return (
    <View className="space-y-4">
      {/* 1. Overall Progress Skeleton */}
      <View className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent shadow-card dark:shadow-none mb-4">
        <View className="flex-row justify-between items-center pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
          <View className="w-36 h-4 bg-neutral-200 rounded-md" />
          <View className="w-24 h-5 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
        </View>
        <View className="flex-row justify-between items-center py-2">
          <View className="space-y-3 flex-1 pr-4">
            <View className="w-20 h-3 bg-neutral-200 rounded-md" />
            <View className="w-28 h-6 bg-neutral-100 dark:bg-neutral-800 rounded-md mb-2" />
            <View className="w-20 h-3 bg-neutral-200 rounded-md" />
            <View className="w-24 h-5 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
          </View>
          <View className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        </View>
      </View>

      {/* 2. Attendance Overview Skeleton */}
      <View className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent shadow-card dark:shadow-none mb-4">
        <View className="flex-row justify-between items-center pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
          <View className="w-40 h-4 bg-neutral-200 rounded-md" />
          <View className="w-16 h-5 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
        </View>
        <View className="flex-row mb-3">
          <View className="flex-1 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mr-2" />
          <View className="flex-1 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl ml-2" />
        </View>
        <View className="flex-row">
          <View className="flex-1 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mr-2" />
          <View className="flex-1 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl ml-2" />
        </View>
      </View>

      {/* 3. Weekly Hours Chart Skeleton */}
      <View className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent shadow-card dark:shadow-none mb-4">
        <View className="flex-row justify-between items-center pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
          <View className="w-32 h-4 bg-neutral-200 rounded-md" />
          <View className="w-14 h-4 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
        </View>
        <View className="h-32 bg-neutral-50 dark:bg-neutral-900 rounded-xl" />
      </View>
    </View>
  );
}

export default AnalyticsSkeleton;
