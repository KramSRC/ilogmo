/**
 * iLogMo - Task Details Screen
 * Displays full task information, toggle status actions, edit navigation, and deletion.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Edit2,
  Trash2,
  RotateCcw,
  Check,
} from 'lucide-react-native';
import { useTasks, Task, TaskPriority } from '@/features/tasks';
import { getTaskDueStatus } from '@/features/tasks/utils/taskUtils';
import { formatJournalDate } from '@/features/journal/utils/journalUtils';
import { Button } from '@/components';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getTaskById, toggleTask, deleteTask, isDeleting } = useTasks();
  const isDark = useThemeStore((state) => state.isDark);

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  // Load Task
  useEffect(() => {
    async function load() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getTaskById(id);
        setTask(data);
      } catch (err) {
        console.warn('[TaskDetailsScreen] Error loading task:', err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id, getTaskById]);

  const handleToggle = async () => {
    if (!task) return;

    setIsToggling(true);
    try {
      const result = await toggleTask(task.id);
      if (result.success && result.data) {
        setTask(result.data);
        Alert.alert(
          'Success',
          result.data.completed ? 'Task completed.' : 'Task marked as pending.'
        );
      } else {
        Alert.alert('Error', result.error || 'Unable to update task status.');
      }
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    if (!task) return;
    router.push({
      pathname: '/task-entry',
      params: { id: task.id },
    });
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert('Delete this task?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteTask(task.id);
          if (result.success) {
            Alert.alert('Success', 'Task deleted.', [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]);
          } else {
            Alert.alert('Error', result.error || 'Unable to delete task.');
          }
        },
      },
    ]);
  };

  const renderPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return (
          <View className="flex-row items-center bg-red-50 dark:bg-red-900/40 px-2.5 py-1 rounded-xl border border-red-200 dark:border-red-800">
            <Text className="text-xs font-bold text-red-600 mr-1.5">!</Text>
            <Text className="text-xs font-bold font-sans text-red-700 dark:text-red-300 uppercase tracking-wider">
              High Priority
            </Text>
          </View>
        );
      case 'medium':
        return (
          <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
            <Text className="text-xs font-bold text-amber-600 mr-1.5">•</Text>
            <Text className="text-xs font-bold font-sans text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Medium Priority
            </Text>
          </View>
        );
      case 'low':
        return (
          <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-xl border border-neutral-200 dark:border-transparent">
            <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mr-1.5">↓</Text>
            <Text className="text-xs font-bold font-sans text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              Low Priority
            </Text>
          </View>
        );
    }
  };

  const dueStatus = task ? getTaskDueStatus(task.dueDate, task.completed) : null;

  return (
    <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)/tasks');
              }
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{ minHeight: 44, minWidth: 44 }}
            className="rounded-full bg-white dark:bg-neutral-900 items-center justify-center border border-neutral-200 dark:border-transparent mr-3 shadow-soft-sm dark:shadow-none"
          >
            <ArrowLeft size={20} color={isDark ? colors.neutral[300] : colors.neutral[700]} />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">Task Details</Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      ) : !task ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-bold font-sans text-neutral-800 dark:text-neutral-200">Task Not Found</Text>
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-1 text-center">
            The requested task could not be located.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
            size="sm"
            className="mt-4"
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          className="px-5 pt-4"
        >
          {/* Main Title & Status Card */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent shadow-card dark:shadow-none mb-4">
            <View className="flex-row items-center justify-between mb-3">
              {renderPriorityBadge(task.priority)}

              {/* Status Badge */}
              <View
                className={`px-3 py-1 rounded-full border ${
                  task.completed ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800' : 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold font-sans ${
                    task.completed ? 'text-emerald-700 dark:text-emerald-300' : 'text-primary-700 dark:text-primary-300'
                  }`}
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </Text>
              </View>
            </View>

            <Text
              className={`text-xl font-bold font-sans leading-7 ${
                task.completed ? 'text-neutral-500 dark:text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {task.title}
            </Text>
          </View>

          {/* Due Date & Timeline Card */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent shadow-card dark:shadow-none mb-4">
            <View className="flex-row items-center pb-2.5 mb-3 border-b border-neutral-100 dark:border-neutral-800">
              <Calendar size={16} color={colors.primary[600]} />
              <Text className="ml-2 text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">
                Timeline & Deadline
              </Text>
            </View>

            {/* Due Date */}
            <View className="flex-row items-center justify-between py-1.5">
              <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Due Date</Text>
              <Text
                className={`text-xs font-bold font-sans ${
                  dueStatus?.isOverdue && !task.completed ? 'text-red-600' : 'text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {dueStatus?.formattedDate}
              </Text>
            </View>

            {/* Created At */}
            <View className="flex-row items-center justify-between py-1.5">
              <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Created</Text>
              <Text className="text-xs font-semibold font-sans text-neutral-700 dark:text-neutral-300">
                {formatJournalDate(task.createdAt.slice(0, 10))}
              </Text>
            </View>

            {/* Completed At if any */}
            {task.completed && task.completedAt ? (
              <View className="flex-row items-center justify-between py-1.5">
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Completed On</Text>
                <Text className="text-xs font-semibold font-sans text-emerald-700 dark:text-emerald-300">
                  {formatJournalDate(task.completedAt.slice(0, 10))}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Description Card */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 border border-neutral-200 dark:border-transparent shadow-card dark:shadow-none mb-5">
            <View className="flex-row items-center pb-2.5 mb-3 border-b border-neutral-100 dark:border-neutral-800">
              <FileText size={16} color={colors.primary[600]} />
              <Text className="ml-2 text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">Description</Text>
            </View>

            <Text className="text-sm font-sans text-neutral-800 dark:text-neutral-200 leading-6 whitespace-pre-wrap">
              {task.description || 'No detailed description provided for this task.'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            {/* Mark Complete / Reopen Action */}
            <Button
              title={task.completed ? 'Mark as Pending' : 'Mark as Complete'}
              onPress={handleToggle}
              variant={task.completed ? 'secondary' : 'primary'}
              size="lg"
              isLoading={isToggling}
              loadingText="Updating..."
              leftIcon={
                task.completed ? (
                  <RotateCcw size={18} color={isDark ? colors.neutral[100] : colors.neutral[800]} />
                ) : (
                  <Check size={18} color="#FFFFFF" strokeWidth={3} />
                )
              }
              className="w-full shadow-button dark:shadow-none"
            />

            <View className="flex-row items-center mt-3">
              <View className="flex-1 mr-2">
                <Button
                  title="Edit Task"
                  onPress={handleEdit}
                  variant="outline"
                  size="md"
                  leftIcon={<Edit2 size={16} color={isDark ? colors.neutral[100] : colors.neutral[800]} />}
                />
              </View>

              <View className="flex-1 ml-2">
                <Button
                  title="Delete Task"
                  onPress={handleDelete}
                  variant="danger"
                  size="md"
                  isLoading={isDeleting}
                  loadingText="Deleting..."
                  leftIcon={<Trash2 size={16} color="#FFFFFF" />}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
