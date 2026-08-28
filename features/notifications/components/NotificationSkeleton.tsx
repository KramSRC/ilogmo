/**
 * iLogMo - NotificationSkeleton Component
 * Loading placeholder skeleton for notification list.
 */

import React from 'react';
import { View } from 'react-native';

export function NotificationSkeleton() {
  return (
    <View className="w-full">
      {[1, 2, 3, 4].map((key) => (
        <View
          key={key}
          className="bg-white dark:bg-neutral-900 rounded-card p-4 mb-3 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent"
        >
          <View className="flex-row items-start">
            {/* Icon Skeleton */}
            <View className="w-10 h-10 rounded-2xl bg-neutral-200 mr-3" />

            {/* Content Skeleton */}
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-2">
                <View className="w-1/2 h-4 bg-neutral-200 rounded-md" />
                <View className="w-12 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
              </View>
              <View className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md mb-1.5" />
              <View className="w-3/4 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export default NotificationSkeleton;
