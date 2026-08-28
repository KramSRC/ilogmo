/**
 * iLogMo - Task Filter Bar Component
 * Provides status tabs (All, Pending, Completed) and priority filtering pills.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TaskFilter, TaskStats } from '../types';

export interface TaskFilterBarProps {
  statusFilter: TaskFilter;
  onSelectStatus: (filter: TaskFilter) => void;
  stats: TaskStats;
}

export function TaskFilterBar({
  statusFilter,
  onSelectStatus,
  stats,
}: TaskFilterBarProps) {
  const statusTabs: { id: TaskFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <View className="mb-4">
      {/* 1. Main Status Segmented Control */}
      <View className="flex-row bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl mb-3 border border-neutral-200 dark:border-transparent">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onSelectStatus(tab.id)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tasks, ${tab.count} items`}
              className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${
                isActive ? 'bg-white dark:bg-neutral-900 shadow-soft-sm dark:shadow-none' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-xs font-sans ${
                  isActive ? 'font-bold text-neutral-900 dark:text-neutral-100' : 'font-medium text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {tab.label}
              </Text>
              <View
                className={`ml-1.5 px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800/50' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold font-sans ${
                    isActive ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default TaskFilterBar;
