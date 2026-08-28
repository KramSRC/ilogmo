/**
 * iLogMo - Task Empty State Component
 * Renders appropriate empty state based on current filter selection.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { CheckSquare, Plus, CheckCircle2, ListTodo } from 'lucide-react-native';
import { TaskFilter } from '../types';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

export interface TaskEmptyStateProps {
  filter: TaskFilter;
  onCreateTask: () => void;
}

export function TaskEmptyState({ filter, onCreateTask }: TaskEmptyStateProps) {
  let title = "You're all caught up.";
  let description = 'Create a task to start organizing your OJT.';
  let Icon = CheckSquare;
  let iconColor: string = colors.primary[600];
  let iconBg = 'bg-primary-50 dark:bg-primary-900/40';
  let iconBorder = 'border-primary-100 dark:border-primary-800/50';
  let showButton = true;

  if (filter === 'pending') {
    title = 'No pending tasks.';
    description = 'No tasks are waiting for you right now.';
    Icon = ListTodo;
    iconColor = colors.success.DEFAULT;
    iconBg = 'bg-emerald-50 dark:bg-emerald-900/40';
    iconBorder = 'border-emerald-100';
  } else if (filter === 'completed') {
    title = 'No completed tasks yet.';
    description = 'Tasks you mark as completed will appear here.';
    Icon = CheckCircle2;
    iconColor = colors.neutral[400];
    iconBg = 'bg-neutral-100 dark:bg-neutral-800';
    iconBorder = 'border-neutral-200 dark:border-transparent';
    showButton = false;
  }

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-8 border border-neutral-200 dark:border-transparent shadow-card dark:shadow-none items-center my-6">
      <View
        className={`w-16 h-16 ${iconBg} rounded-3xl items-center justify-center mb-4 border ${iconBorder}`}
      >
        <Icon size={30} color={iconColor} />
      </View>

      <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100 text-center mb-2">{title}</Text>

      <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400 text-center leading-5 mb-6 max-w-xs">
        {description}
      </Text>

      {showButton ? (
        <Button
          title="Create Task"
          onPress={onCreateTask}
          variant="primary"
          size="md"
          leftIcon={<Plus size={18} color="#FFFFFF" />}
          className="w-full"
        />
      ) : null}
    </View>
  );
}

export default TaskEmptyState;
