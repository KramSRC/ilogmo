/**
 * iLogMo - Tasks Skeleton Loader
 */

import React from 'react';
import { View } from 'react-native';

export function TaskSkeleton() {
  return (
    <View className="space-y-3 mt-1">
      {[1, 2, 3, 4].map((key) => (
        <View
          key={key}
          className="bg-white rounded-card p-4 mb-3 border border-neutral-200 shadow-card flex-row items-start"
        >
          {/* Checkbox skeleton */}
          <View className="w-6 h-6 rounded-lg bg-neutral-200 mr-3" />

          {/* Text lines */}
          <View className="flex-1">
            <View className="w-3/4 h-4 bg-neutral-200 rounded-md mb-2" />
            <View className="w-full h-3 bg-neutral-100 rounded-md mb-2" />
            <View className="flex-row items-center">
              <View className="w-14 h-4 bg-neutral-100 rounded-md mr-2" />
              <View className="w-20 h-4 bg-neutral-100 rounded-md" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export default TaskSkeleton;
