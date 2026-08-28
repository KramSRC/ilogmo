/**
 * iLogMo - DocumentSkeleton Component
 * Loading placeholder skeleton for Document list.
 */

import React from 'react';
import { View } from 'react-native';

export function DocumentSkeleton() {
  return (
    <View className="w-full">
      {[1, 2, 3, 4].map((key) => (
        <View
          key={key}
          className="bg-white dark:bg-neutral-900 rounded-card p-4 mb-3 shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800"
        >
          <View className="flex-row items-start">
            {/* Icon Skeleton */}
            <View className="w-11 h-11 rounded-2xl bg-neutral-200 mr-3" />

            {/* Content Skeleton */}
            <View className="flex-1">
              <View className="w-3/4 h-4 bg-neutral-200 rounded-md mb-2" />
              <View className="w-1/3 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md mb-2" />
              <View className="w-1/2 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export default DocumentSkeleton;
