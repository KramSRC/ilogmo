/**
 * iLogMo - Journal Skeleton Loader
 */

import React from 'react';
import { View } from 'react-native';

export function JournalSkeleton() {
  return (
    <View className="space-y-3.5 mt-2">
      {[1, 2, 3].map((key) => (
        <View
          key={key}
          className="bg-white dark:bg-neutral-900 rounded-card p-5 mb-3.5 border border-neutral-200 dark:border-neutral-800 shadow-card"
        >
          {/* Date skeleton */}
          <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
            <View className="w-36 h-4 bg-neutral-200 rounded-md" />
          </View>

          {/* Section 1 */}
          <View className="w-24 h-3 bg-neutral-200 rounded-md mb-2" />
          <View className="w-full h-3.5 bg-neutral-100 rounded-md mb-1.5" />
          <View className="w-3/4 h-3.5 bg-neutral-100 rounded-md mb-3" />

          {/* Section 2 */}
          <View className="w-20 h-3 bg-neutral-200 rounded-md mb-2" />
          <View className="w-full h-3.5 bg-neutral-100 rounded-md mb-1.5" />
          <View className="w-2/3 h-3.5 bg-neutral-100 rounded-md" />
        </View>
      ))}
    </View>
  );
}

export default JournalSkeleton;
