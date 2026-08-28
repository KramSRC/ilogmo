/**
 * iLogMo - ReportTaskSection Component
 * Formal summary card for Total Tasks, Completed, Pending, Overdue, and Completion Rate.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckSquare, ChevronRight } from 'lucide-react-native';
import { ReportTaskSummary } from '../types';
import { colors } from '@/constants/colors';

export interface ReportTaskSectionProps {
  tasks: ReportTaskSummary;
}

export function ReportTaskSection({ tasks }: ReportTaskSectionProps) {
  const router = useRouter();
  const hasTasks = tasks.totalTasks > 0;

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 items-center justify-center mr-2.5">
            <CheckSquare size={16} color="#4F46E5" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Tasks Summary</Text>
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Deliverables and completion</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(app)/tasks')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="View task list"
          style={{ minHeight: 44 }}
          className="flex-row items-center justify-center px-2 py-1 -mr-2"
        >
          <Text className="text-xs font-bold font-sans text-primary-600 mr-0.5">Tasks</Text>
          <ChevronRight size={14} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {!hasTasks ? (
        <View className="py-4 items-center justify-center">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 text-center">
            No tasks recorded yet.
          </Text>
        </View>
      ) : (
        <>
          {/* 4-Item Grid */}
          <View className="flex-row flex-wrap justify-between -mx-1 mb-3">
            {/* 1. Total */}
            <View className="w-1/2 px-1 mb-2.5">
              <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 flex-row items-center justify-between">
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Total Tasks</Text>
                <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">{tasks.totalTasks}</Text>
              </View>
            </View>

            {/* 2. Completed */}
            <View className="w-1/2 px-1 mb-2.5">
              <View className="bg-emerald-50 dark:bg-emerald-900/40/60 border border-emerald-100 rounded-xl p-2.5 flex-row items-center justify-between">
                <Text className="text-xs font-sans text-emerald-800">Completed</Text>
                <Text className="text-sm font-bold font-sans text-emerald-700 dark:text-emerald-300">{tasks.completedTasks}</Text>
              </View>
            </View>

            {/* 3. Pending */}
            <View className="w-1/2 px-1">
              <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 flex-row items-center justify-between">
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Pending</Text>
                <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200">{tasks.pendingTasks}</Text>
              </View>
            </View>

            {/* 4. Overdue */}
            <View className="w-1/2 px-1">
              <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 flex-row items-center justify-between">
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Overdue</Text>
                <Text
                  className={`text-sm font-bold font-sans ${
                    tasks.overdueTasks > 0 ? 'text-red-600' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {tasks.overdueTasks}
                </Text>
              </View>
            </View>
          </View>

          {/* Completion Rate Pill */}
          <View className="bg-primary-50 dark:bg-primary-900/40/70 border border-primary-200 rounded-xl p-3 flex-row items-center justify-between">
            <Text className="text-xs font-bold font-sans text-primary-900">Task Completion Rate</Text>
            <Text className="text-sm font-extrabold font-sans text-primary-700 dark:text-primary-300">
              {tasks.completionRateFormatted}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

export default ReportTaskSection;
