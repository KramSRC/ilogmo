import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, ChevronRight } from 'lucide-react-native';
import { DashboardTask } from '../types';
import { colors } from '@/constants/colors';

export interface TodayTasksProps {
  tasks: DashboardTask[];
  onToggleTask: (taskId: string) => void;
}

export function TodayTasks({ tasks, onToggleTask }: TodayTasksProps) {
  const router = useRouter();

  const displayTasks = tasks.slice(0, 3);

  return (
    <View className="mb-6">
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold font-sans text-neutral-900">Today's Tasks</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/tasks')}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="flex-row items-center"
        >
          <Text className="text-xs font-semibold font-sans text-primary-600 mr-0.5">View All</Text>
          <ChevronRight size={14} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Task List Container */}
      <View className="bg-white rounded-card p-4 shadow-card border border-neutral-200">
        {displayTasks.length === 0 ? (
          <Text className="text-sm font-sans text-neutral-400 py-3 text-center">
            No tasks scheduled for today.
          </Text>
        ) : (
          displayTasks.map((task, index) => {
            const isLast = index === displayTasks.length - 1;
            return (
              <TouchableOpacity
                key={task.id}
                onPress={() => onToggleTask(task.id)}
                activeOpacity={0.75}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.completed }}
                className={`flex-row items-center py-3 ${isLast ? '' : 'border-b border-neutral-100'}`}
              >
                {/* Custom Checkbox */}
                <View
                  className={`w-5 h-5 rounded-md items-center justify-center mr-3 border ${
                    task.completed
                      ? 'bg-primary-600 border-primary-600'
                      : 'bg-white border-neutral-300'
                  }`}
                >
                  {task.completed ? <Check size={13} color="#FFFFFF" strokeWidth={3} /> : null}
                </View>

                {/* Title */}
                <Text
                  className={`flex-1 text-sm font-sans mr-2 ${
                    task.completed
                      ? 'text-neutral-400 line-through'
                      : 'text-neutral-800 font-medium'
                  }`}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>

                {/* Priority Pill */}
                {task.priority === 'high' && !task.completed ? (
                  <View className="bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    <Text className="text-[10px] font-semibold font-sans text-red-600">High</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
}

export default TodayTasks;
