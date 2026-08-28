/**
 * iLogMo - Journal Card Component
 * Displays a summary card for a single journal entry in the recent entries feed.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Calendar, Clock, BookOpen, Lightbulb } from 'lucide-react-native';
import { JournalEntry } from '../types';
import { formatJournalDate, formatJournalTime } from '../utils/journalUtils';
import { colors } from '@/constants/colors';

export interface JournalCardProps {
  entry: JournalEntry;
  onPress: (entry: JournalEntry) => void;
}

export function JournalCard({ entry, onPress }: JournalCardProps) {
  const formattedDate = formatJournalDate(entry.entryDate);
  const formattedTime = formatJournalTime(entry.createdAt);

  return (
    <TouchableOpacity
      onPress={() => onPress(entry)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View journal entry for ${formattedDate}`}
      className="bg-white dark:bg-neutral-900 rounded-card p-5 mb-3.5 border border-neutral-200 dark:border-neutral-800 shadow-card dark:shadow-none"
    >
      {/* Date & Time Header */}
      <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center flex-1 mr-2">
          <Calendar size={16} color={colors.primary[600]} />
          <Text className="ml-2 text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100">{formattedDate}</Text>
        </View>

        {formattedTime ? (
          <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
            <Clock size={12} color={colors.neutral[500]} />
            <Text className="ml-1 text-[11px] font-semibold font-sans text-neutral-600 dark:text-neutral-400">
              {formattedTime}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Today's Work Section */}
      <View className="mb-3">
        <View className="flex-row items-center mb-1">
          <BookOpen size={14} color={colors.neutral[500]} />
          <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
            Worked on:
          </Text>
        </View>
        <Text
          className="text-sm font-sans text-neutral-800 dark:text-neutral-200 leading-5"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {entry.workDescription}
        </Text>
      </View>

      {/* What I Learned Section */}
      <View className="mb-3">
        <View className="flex-row items-center mb-1">
          <Lightbulb size={14} color={colors.warning.DEFAULT} />
          <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
            Learned:
          </Text>
        </View>
        <Text
          className="text-sm font-sans text-neutral-800 dark:text-neutral-200 leading-5"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {entry.learningDescription}
        </Text>
      </View>

      {/* View Entry Footer CTA */}
      <View className="flex-row items-center justify-end pt-2 mt-1 border-t border-neutral-50">
        <Text className="text-xs font-semibold font-sans text-primary-600 mr-1">View Entry</Text>
        <ChevronRight size={14} color={colors.primary[600]} />
      </View>
    </TouchableOpacity>
  );
}

export default JournalCard;
