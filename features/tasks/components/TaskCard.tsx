/**
 * iLogMo - Task Card Component
 * Displays a single task item with interactive completion toggle, priority badge, and due date.
 */

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Check, Calendar, ChevronRight } from 'lucide-react-native';
import { Task, TaskPriority } from '../types';
import { getTaskDueStatus } from '../utils/taskUtils';
import { colors } from '@/constants/colors';

export interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
  isToggling?: boolean;
}

export function TaskCard({ task, onToggle, onPress, isToggling = false }: TaskCardProps) {
  const dueStatus = getTaskDueStatus(task.dueDate, task.completed);

  // Priority metadata (symbols & styles so not color-only)
  const renderPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return (
          <View className="flex-row items-center bg-red-50 dark:bg-red-900/40 px-2 py-0.5 rounded-md border border-red-100 mr-2">
            <Text className="text-xs font-bold text-red-600 mr-1">!</Text>
            <Text className="text-[10px] font-bold font-sans text-red-700 dark:text-red-300 uppercase tracking-wider">
              High
            </Text>
          </View>
        );
      case 'medium':
        return (
          <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/40 px-2 py-0.5 rounded-md border border-amber-100 mr-2">
            <Text className="text-xs font-bold text-amber-600 mr-1">•</Text>
            <Text className="text-[10px] font-bold font-sans text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Med
            </Text>
          </View>
        );
      case 'low':
        return (
          <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-transparent mr-2">
            <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mr-1">↓</Text>
            <Text className="text-[10px] font-bold font-sans text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Low
            </Text>
          </View>
        );
    }
  };

  // Due Date Badge styling
  const renderDueDateBadge = () => {
    if (!dueStatus.hasDueDate) {
      return (
        <View className="flex-row items-center">
          <Calendar size={12} color={colors.neutral[400]} />
          <Text className="ml-1 text-[11px] font-sans text-neutral-400">No due date</Text>
        </View>
      );
    }

    if (task.completed) {
      return (
        <View className="flex-row items-center">
          <Calendar size={12} color={colors.neutral[400]} />
          <Text className="ml-1 text-[11px] font-sans text-neutral-400">
            {dueStatus.badgeLabel}
          </Text>
        </View>
      );
    }

    if (dueStatus.isOverdue) {
      return (
        <View className="flex-row items-center bg-red-50 dark:bg-red-900/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800">
          <Calendar size={11} color={colors.error.DEFAULT} />
          <Text className="ml-1 text-[11px] font-bold font-sans text-red-600">
            {dueStatus.badgeLabel}
          </Text>
        </View>
      );
    }

    if (dueStatus.isDueToday) {
      return (
        <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
          <Calendar size={11} color={colors.warning.DEFAULT} />
          <Text className="ml-1 text-[11px] font-bold font-sans text-amber-800 dark:text-amber-300">Due today</Text>
        </View>
      );
    }

    if (dueStatus.isDueSoon) {
      return (
        <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-100">
          <Calendar size={11} color={colors.primary[600]} />
          <Text className="ml-1 text-[11px] font-medium font-sans text-primary-700 dark:text-primary-300">
            {dueStatus.badgeLabel}
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-row items-center">
        <Calendar size={12} color={colors.neutral[500]} />
        <Text className="ml-1 text-[11px] font-sans text-neutral-600 dark:text-neutral-400">{dueStatus.badgeLabel}</Text>
      </View>
    );
  };

  const a11yLabel = `${task.title}, ${task.priority} priority, ${dueStatus.formattedDate}, ${
    task.completed ? 'completed' : 'pending'
  }.`;

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-4 mb-3 border border-neutral-200 dark:border-transparent shadow-card dark:shadow-none">
      <View className="flex-row items-start">
        {/* Checkbox Trigger */}
        <TouchableOpacity
          onPress={() => onToggle(task.id)}
          activeOpacity={0.7}
          disabled={isToggling}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          accessibilityLabel={task.completed ? 'Mark task as pending' : 'Mark task as complete'}
          className="mr-3 pt-0.5 min-w-[28px] min-h-[28px] items-center justify-center"
        >
          {isToggling ? (
            <ActivityIndicator size="small" color={colors.primary[600]} />
          ) : (
            <View
              className={`w-6 h-6 rounded-lg items-center justify-center border ${
                task.completed ? 'bg-primary-600 border-primary-600' : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
              }`}
            >
              {task.completed ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
            </View>
          )}
        </TouchableOpacity>

        {/* Task Body (Tappable for details) */}
        <TouchableOpacity
          onPress={() => onPress(task)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          className="flex-1"
        >
          {/* Title */}
          <Text
            className={`text-base font-sans font-semibold mb-1 leading-5 ${
              task.completed ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100'
            }`}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* Description Snippet if present */}
          {task.description ? (
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mb-2 leading-4" numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}

          {/* Metadata Badges Row */}
          <View className="flex-row items-center justify-between mt-1">
            <View className="flex-row items-center flex-wrap">
              {renderPriorityBadge(task.priority)}
              {renderDueDateBadge()}
            </View>

            <ChevronRight size={14} color={colors.neutral[400]} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TaskCard;
