/**
 * iLogMo - Task Filter Bar Component
 * Provides status tabs (All, Pending, Completed) and priority filtering pills.
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TaskFilter, TaskPriorityFilter, TaskStats } from '../types';

export interface TaskFilterBarProps {
  statusFilter: TaskFilter;
  onSelectStatus: (filter: TaskFilter) => void;
  priorityFilter: TaskPriorityFilter;
  onSelectPriority: (priority: TaskPriorityFilter) => void;
  stats: TaskStats;
}

export function TaskFilterBar({
  statusFilter,
  onSelectStatus,
  priorityFilter,
  onSelectPriority,
  stats,
}: TaskFilterBarProps) {
  const statusTabs: { id: TaskFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  const priorityPills: { id: TaskPriorityFilter; label: string }[] = [
    { id: 'all', label: 'All Priority' },
    { id: 'high', label: 'High Priority' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
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

      {/* 2. Priority Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerStyle={{ paddingRight: 8 }}
      >
        {priorityPills.map((pill) => {
          const isSelected = priorityFilter === pill.id;
          return (
            <TouchableOpacity
              key={pill.id}
              onPress={() => onSelectPriority(pill.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter by ${pill.label}`}
              className={`px-3 py-1.5 rounded-full mr-2 border min-h-[32px] items-center justify-center ${
                isSelected ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100' : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <Text
                className={`text-xs font-sans ${
                  isSelected ? 'font-semibold text-white dark:text-neutral-900' : 'font-medium text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {pill.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default TaskFilterBar;
