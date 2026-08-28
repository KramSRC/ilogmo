/**
 * iLogMo - Analytical Insights Card
 * Displays concise, calculated insight bullets derived from real attendance metrics.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Lightbulb, TrendingUp, CheckCircle, Clock, Calendar } from 'lucide-react-native';
import { AnalyticsInsight } from '../types';
import { colors } from '@/constants/colors';

export interface InsightsCardProps {
  insights: AnalyticsInsight[];
}

export function InsightsCard({ insights }: InsightsCardProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const renderIcon = (iconType: AnalyticsInsight['icon']) => {
    switch (iconType) {
      case 'trending':
        return <TrendingUp size={15} color={colors.primary[600]} />;
      case 'check':
        return <CheckCircle size={15} color={colors.success.DEFAULT} />;
      case 'clock':
        return <Clock size={15} color={colors.primary[600]} />;
      case 'calendar':
        return <Calendar size={15} color="#9333EA" />;
      default:
        return <Lightbulb size={15} color={colors.warning.DEFAULT} />;
    }
  };

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/40 items-center justify-center mr-2.5 border border-amber-100 dark:border-amber-800/50">
            <Lightbulb size={16} color={colors.warning.DEFAULT} />
          </View>
          <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Key Insights</Text>
        </View>
      </View>

      {/* Insights List */}
      <View className="space-y-2.5">
        {insights.map((insight) => (
          <View
            key={insight.id}
            className="flex-row items-start p-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 mb-2"
          >
            <View className="mr-2.5 mt-0.5">{renderIcon(insight.icon)}</View>
            <Text className="text-xs font-medium font-sans text-neutral-800 dark:text-neutral-200 flex-1 leading-5">
              {insight.message}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default InsightsCard;
