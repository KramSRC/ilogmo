/**
 * iLogMo - ProfileSkeleton Component
 * Loading placeholder skeleton for Student Profile.
 */

import React from 'react';
import { View } from 'react-native';

export function ProfileSkeleton() {
  return (
    <View className="w-full">
      {/* Avatar & Header Skeleton */}
      <View className="items-center mb-6">
        <View className="w-24 h-24 rounded-full bg-neutral-200 mb-3" />
        <View className="w-40 h-5 bg-neutral-200 rounded-md mb-2" />
        <View className="w-28 h-3.5 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
      </View>

      {/* Info Card Skeleton */}
      <View className="bg-white dark:bg-neutral-900 rounded-card p-5 mb-4 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent">
        <View className="w-36 h-4 bg-neutral-200 rounded-md mb-4" />
        <View className="space-y-3">
          <View className="w-full h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-2" />
          <View className="w-full h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-2" />
          <View className="w-full h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
        </View>
      </View>

      {/* OJT Card Skeleton */}
      <View className="bg-white dark:bg-neutral-900 rounded-card p-5 mb-4 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent">
        <View className="w-32 h-4 bg-neutral-200 rounded-md mb-4" />
        <View className="space-y-3">
          <View className="w-full h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-2" />
          <View className="w-full h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-2" />
          <View className="w-full h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
        </View>
      </View>
    </View>
  );
}

export default ProfileSkeleton;
