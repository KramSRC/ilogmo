/**
 * iLogMo - Tasks Main Screen
 * Displays task list with status/priority filtering, inline completion toggling, and create actions.
 */

import React from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useTasks, Task } from '@/features/tasks';
import { TaskCard, TaskFilterBar, TaskEmptyState, TaskSkeleton } from '@/features/tasks/components';
import { Button, ErrorMessage, NotificationBellButton } from '@/components';
import { colors } from '@/constants/colors';

export default function TasksScreen() {
  const router = useRouter();
  const {
    tasks,
    stats,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    isLoading,
    isRefreshing,
    isTogglingId,
    error,
    refresh,
    toggleTask,
  } = useTasks();

  const handleCreateNew = () => {
    router.push('/(app)/task-entry');
  };

  const handleSelectTask = (task: Task) => {
    router.push({
      pathname: '/(app)/task-details',
      params: { id: task.id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right']}>
      {/* 1. Header Bar */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <View className="flex-1 mr-3">
          <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
            Tasks
          </Text>
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">
            Stay organized during your OJT
          </Text>
        </View>

        {/* Notification Bell */}
        <NotificationBellButton />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary[600]}
            colors={[colors.primary[600]]}
          />
        }
        className="px-5 pt-3"
      >
        {/* New Task Action Button */}
        <TouchableOpacity
          onPress={handleCreateNew}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Add new task"
          className="flex-row items-center justify-center bg-primary-600 py-3.5 px-4 rounded-2xl shadow-card mb-4 min-h-[48px]"
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-sm font-bold font-sans text-white ml-2">Add New Task</Text>
        </TouchableOpacity>
        {/* 2. Error Display */}
        {error ? (
          <View className="mb-4">
            <ErrorMessage message={error} type="error" />
            <Button
              title="Try Again"
              onPress={refresh}
              variant="outline"
              size="sm"
              className="mt-2"
            />
          </View>
        ) : null}

        {/* 3. Filter Bar */}
        <TaskFilterBar
          statusFilter={statusFilter}
          onSelectStatus={setStatusFilter}
          priorityFilter={priorityFilter}
          onSelectPriority={setPriorityFilter}
          stats={stats}
        />

        {/* 4. Task List or Empty / Skeleton State */}
        {isLoading && !isRefreshing ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <TaskEmptyState filter={statusFilter} onCreateTask={handleCreateNew} />
        ) : (
          <View className="mt-1">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onPress={handleSelectTask}
                isToggling={isTogglingId === task.id}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
