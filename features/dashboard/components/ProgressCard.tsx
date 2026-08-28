import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { ChevronRight, Calendar, TrendingUp } from 'lucide-react-native';
import { OjtProgress } from '../types';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

export interface ProgressCardProps {
  progress: OjtProgress;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  const router = useRouter();
  const isDark = useThemeStore((state) => state.isDark);

  // SVG Circular Ring Dimensions
  const size = 104;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress.progressPercentage / 100) * circumference;

  return (
    <TouchableOpacity
      onPress={() => router.push('/(app)/analytics')}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="View OJT Analytics"
      className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-5"
    >
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/40 items-center justify-center mr-2.5 border border-primary-100 dark:border-primary-800/50">
            <TrendingUp size={16} color={colors.primary[600]} />
          </View>
          <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">OJT Progress</Text>
        </View>
        <ChevronRight size={18} color={colors.neutral[400]} />
      </View>

      {/* Main Stats & Circular Ring Row */}
      <View className="flex-row items-center justify-between mb-4">
        {/* Left Stats */}
        <View className="flex-1 pr-2">
          <View className="flex-row items-baseline">
            <Text className="text-3xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
              {progress.completedHours}
            </Text>
            <Text className="ml-1 text-sm font-semibold font-sans text-neutral-500 dark:text-neutral-400">hrs</Text>
            <Text className="ml-1 text-sm font-sans text-neutral-400">
              / {progress.requiredHours} hrs
            </Text>
          </View>

          {/* Remaining Hours Pill */}
          <View className="flex-row items-center mt-2.5">
            <View className="bg-primary-50 dark:bg-primary-900/40 px-2.5 py-1 rounded-full border border-primary-100 dark:border-primary-800/50">
              <Text className="text-xs font-semibold font-sans text-primary-700 dark:text-primary-300">
                {progress.remainingHours} hrs remaining
              </Text>
            </View>
          </View>
        </View>

        {/* Right Circular Progress Ring */}
        <View className="items-center justify-center relative w-[104px] h-[104px]">
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Track Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isDark ? colors.neutral[800] : '#EFF6FF'}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.primary[600]}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          {/* Centered Percentage */}
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
              {progress.progressPercentage}%
            </Text>
          </View>
        </View>
      </View>

      {/* Estimated Completion Footer */}
      <View className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Calendar size={13} color={colors.neutral[400]} />
          <Text className="ml-1.5 text-xs font-sans text-neutral-500 dark:text-neutral-400">Estimated completion</Text>
        </View>
        <Text className="text-xs font-semibold font-sans text-neutral-700 dark:text-neutral-300">
          {progress.estimatedCompletionDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default ProgressCard;
