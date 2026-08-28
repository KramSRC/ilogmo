/**
 * iLogMo - Create & Edit Task Screen
 * Provides input forms for task title, description, due date, and priority selection.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTasks, TaskPriority } from '@/features/tasks';
import { Button, DatePickerInput, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function TaskEntryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const { createTask, updateTask, getTaskById, isSaving } = useTasks();

  // Form State
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(isEditing);

  // Load existing task if editing
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    async function loadTask() {
      setIsLoadingInitial(true);
      try {
        const task = await getTaskById(id!);
        if (isMounted && task) {
          setTitle(task.title);
          setDescription(task.description || '');
          setDueDate(task.dueDate || '');
          setPriority(task.priority);
        } else if (isMounted) {
          setFormError('Could not find the requested task.');
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[TaskEntryScreen] Error loading task:', err);
          setFormError('Failed to load task for editing.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingInitial(false);
        }
      }
    }

    loadTask();

    return () => {
      isMounted = false;
    };
  }, [id, getTaskById]);

  // Reset on focus when creating new task
  useFocusEffect(
    useCallback(() => {
      if (!id) {
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('medium');
        setErrors({});
        setFormError(null);
        setIsLoadingInitial(false);
      }
    }, [id])
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      newErrors.title = 'Task title is required.';
    } else if (cleanTitle.length < 3) {
      newErrors.title = 'Task title must be at least 3 characters.';
    } else if (cleanTitle.length > 150) {
      newErrors.title = 'Task title cannot exceed 150 characters.';
    }

    const cleanDesc = description.trim();
    if (cleanDesc.length > 5000) {
      newErrors.description = 'Description cannot exceed 5,000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isSaving) return;
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    if (isEditing && id) {
      const result = await updateTask(id, {
        title,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
      });

      if (result.success) {
        Alert.alert('Success', 'Task updated.', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        setFormError(result.error || 'Unable to update task.');
      }
    } else {
      const result = await createTask({
        title,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
      });

      if (result.success) {
        Alert.alert('Success', 'Task created.', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        setFormError(result.error || 'Unable to create task.');
      }
    }
  };

  const priorities: { id: TaskPriority; label: string; symbol: string }[] = [
    { id: 'low', label: 'Low', symbol: '↓' },
    { id: 'medium', label: 'Medium', symbol: '•' },
    { id: 'high', label: 'High', symbol: '!' },
  ];

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
            className="rounded-full bg-white dark:bg-neutral-900 items-center justify-center border border-neutral-200 dark:border-neutral-800 mr-3 shadow-soft-sm"
          >
            <ArrowLeft size={20} color={colors.neutral[700]} />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
              {isEditing ? 'Edit Task' : 'New Task'}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          className="px-5 pt-4"
        >
          {/* Form Error Banner */}
          {formError ? (
            <View className="mb-4">
              <ErrorMessage message={formError} type="error" />
            </View>
          ) : null}

          {/* 1. Task Title */}
          <View className="mb-4">
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-1.5">
              Task Title *
            </Text>
            <View
              className={`bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border ${
                errors.title ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <TextInput
                placeholder="What do you need to do?"
                placeholderTextColor={colors.neutral[400]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  setErrors((prev) => ({ ...prev, title: '' }));
                }}
                maxLength={150}
                editable={!isSaving && !isLoadingInitial}
                className="text-base font-sans text-neutral-900 dark:text-neutral-100"
              />
            </View>
            {errors.title ? (
              <Text className="text-xs font-sans text-red-500 mt-1">{errors.title}</Text>
            ) : null}
          </View>

          {/* 2. Priority Selection */}
          <View className="mb-4">
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-1.5">
              Priority *
            </Text>
            <View className="flex-row bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              {priorities.map((item) => {
                const isSelected = priority === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setPriority(item.id)}
                    activeOpacity={0.7}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    className={`flex-1 py-2.5 rounded-xl items-center justify-center flex-row ${
                      isSelected ? 'bg-white dark:bg-neutral-900 shadow-soft-sm' : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold mr-1 ${
                        isSelected
                          ? item.id === 'high'
                            ? 'text-red-600'
                            : item.id === 'medium'
                              ? 'text-amber-600'
                              : 'text-neutral-600 dark:text-neutral-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      {item.symbol}
                    </Text>
                    <Text
                      className={`text-xs font-sans ${
                        isSelected ? 'font-bold text-neutral-900 dark:text-neutral-100' : 'font-medium text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 3. Due Date */}
          <View className="mb-4">
            <DatePickerInput
              label="Due Date (Optional)"
              value={dueDate}
              onChangeDate={setDueDate}
              placeholder="Select due date"
              clearable
              disabled={isSaving || isLoadingInitial}
            />
          </View>

          {/* 4. Description */}
          <View className="mb-6">
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-1.5">
              Description <Text className="text-neutral-400 font-normal">(Optional)</Text>
            </Text>
            <View className="bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border border-neutral-200 dark:border-neutral-800">
              <TextInput
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Add more details or deliverables..."
                placeholderTextColor={colors.neutral[400]}
                value={description}
                onChangeText={setDescription}
                maxLength={5000}
                editable={!isSaving && !isLoadingInitial}
                className="text-base font-sans text-neutral-900 dark:text-neutral-100 min-h-[100px]"
              />
            </View>
            {errors.description ? (
              <Text className="text-xs font-sans text-red-500 mt-1">{errors.description}</Text>
            ) : null}
          </View>

          {/* 5. Save Action Button */}
          <Button
            title={isEditing ? 'Save Changes' : 'Create Task'}
            isLoading={isSaving}
            loadingText={isEditing ? 'Saving...' : 'Creating...'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            className="w-full shadow-button"
            disabled={isSaving || isLoadingInitial}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
