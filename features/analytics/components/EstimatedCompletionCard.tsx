/**
 * iLogMo - Estimated Completion Forecast Card
 * Projects estimated date of completion based on actual historical attendance pace and schedule.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, Calendar, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { CompletionEstimate } from '../types';
import { colors } from '@/constants/colors';

export interface EstimatedCompletionCardProps {
  estimate: CompletionEstimate;
}

export function EstimatedCompletionCard({ estimate }: EstimatedCompletionCardProps) {
  return (
    <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-purple-50 items-center justify-center mr-2.5 border border-purple-100">
            <Sparkles size={16} color="#9333EA" />
          </View>
          <Text className="text-base font-bold font-sans text-neutral-900">
            Estimated Completion
          </Text>
        </View>
      </View>

      {/* Content based on sufficiency */}
      {estimate.hasSufficientData ? (
        <View>
          {/* Main Date Display */}
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-2xl bg-purple-50 items-center justify-center mr-3 border border-purple-100">
              <Calendar size={20} color="#9333EA" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-wider">
                Projected Finish Date
              </Text>
              <Text className="text-lg font-bold font-sans text-neutral-900">
                {estimate.estimatedCompletionDate}
              </Text>
            </View>
          </View>

          {/* Explanation / Warning Alert */}
          {estimate.isOverdueWarning ? (
            <View className="mt-2 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex-row items-start">
              <AlertTriangle size={16} color={colors.warning.DEFAULT} style={{ marginTop: 1 }} />
              <Text className="ml-2 text-xs font-sans text-amber-900 leading-4 flex-1">
                {estimate.message}
              </Text>
            </View>
          ) : (
            <View className="mt-2 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex-row items-start">
              <CheckCircle size={16} color={colors.success.DEFAULT} style={{ marginTop: 1 }} />
              <Text className="ml-2 text-xs font-sans text-emerald-900 leading-4 flex-1">
                {estimate.message}
              </Text>
            </View>
          )}

          {estimate.estimatedDaysRemaining !== undefined ? (
            <Text className="text-[11px] font-sans text-neutral-400 mt-2 text-right">
              Approx. {estimate.estimatedDaysRemaining} scheduled working shifts remaining
            </Text>
          ) : null}
        </View>
      ) : (
        /* Insufficient Data State */
        <View className="py-2 items-center">
          <Text className="text-sm font-sans text-neutral-500 text-center leading-5 mb-1">
            {estimate.message}
          </Text>
          {estimate.expectedEndDate ? (
            <Text className="text-xs font-medium font-sans text-neutral-400 text-center mt-1">
              Expected End Date: {estimate.expectedEndDate}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

export default EstimatedCompletionCard;
