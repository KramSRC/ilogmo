/**
 * iLogMo - Overall OJT Progress Card
 * Displays the student's global completion status, circular progress, and hours breakdown.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { TrendingUp, Clock, CheckCircle2 } from 'lucide-react-native';
import { OjtProgressStats } from '../types';
import { colors } from '@/constants/colors';

export interface OverallProgressCardProps {
  progress: OjtProgressStats;
}

export function OverallProgressCard({ progress }: OverallProgressCardProps) {
  // SVG Circular Ring Dimensions
  const size = 108;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress.progressPercentage / 100) * circumference;

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card border border-neutral-200 dark:border-neutral-800 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/40 items-center justify-center mr-2.5 border border-primary-100 dark:border-primary-800/50">
            <TrendingUp size={16} color={colors.primary[600]} />
          </View>
          <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Overall Progress</Text>
        </View>

        <View className="bg-primary-50 dark:bg-primary-900/40 px-2.5 py-1 rounded-full border border-primary-100 dark:border-primary-800/50">
          <Text className="text-xs font-semibold font-sans text-primary-700 dark:text-primary-300">
            {progress.requiredHours}h Required
          </Text>
        </View>
      </View>

      {/* Main Stats and Circular Meter */}
      <View className="flex-row items-center justify-between py-1">
        {/* Left Breakdown */}
        <View className="flex-1 pr-3">
          {/* Completed Hours */}
          <View className="mb-2.5">
            <View className="flex-row items-center mb-0.5">
              <CheckCircle2 size={13} color={colors.success.DEFAULT} />
              <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Completed
              </Text>
            </View>
            <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
              {progress.completedHoursFormatted}
            </Text>
          </View>

          {/* Remaining Hours */}
          <View>
            <View className="flex-row items-center mb-0.5">
              <Clock size={13} color={colors.neutral[400]} />
              <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Remaining
              </Text>
            </View>
            <Text className="text-base font-semibold font-sans text-neutral-700 dark:text-neutral-300">
              {progress.remainingHoursFormatted}
            </Text>
          </View>
        </View>

        {/* Right Circular Meter */}
        <View className="items-center justify-center relative w-[108px] h-[108px]">
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Track Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#EFF6FF"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Arc */}
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
            <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
              {progress.progressPercentage}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default OverallProgressCard;
