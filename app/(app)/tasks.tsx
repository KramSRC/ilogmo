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
import { Button, ErrorMessage } from '@/components';
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
    router.push('/task-entry');
  };

  const handleSelectTask = (task: Task) => {
    router.push({
      pathname: '/task-details',
      params: { id: task.id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      {/* 1. Header Bar */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 bg-white">
        <View className="flex-1 mr-3">
          <Text className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
            Tasks
          </Text>
          <Text className="text-xs font-sans text-neutral-500">
            Stay organized during your OJT
          </Text>
        </View>

        {/* Top New Task CTA */}
        <TouchableOpacity
          onPress={handleCreateNew}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Create new task"
          className="flex-row items-center bg-primary-600 px-3.5 py-2.5 rounded-xl shadow-soft-sm min-h-[44px]"
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-sm font-semibold font-sans text-white ml-1.5">New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
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
