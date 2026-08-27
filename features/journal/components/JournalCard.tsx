/**
 * iLogMo - Journal Card Component
 * Displays a summary card for a single journal entry in the recent entries feed.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Calendar, BookOpen, Lightbulb } from 'lucide-react-native';
import { JournalEntry } from '../types';
import { formatJournalDate } from '../utils/journalUtils';
import { colors } from '@/constants/colors';

export interface JournalCardProps {
  entry: JournalEntry;
  onPress: (entry: JournalEntry) => void;
}

export function JournalCard({ entry, onPress }: JournalCardProps) {
  const formattedDate = formatJournalDate(entry.entryDate);

  return (
    <TouchableOpacity
      onPress={() => onPress(entry)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View journal entry for ${formattedDate}`}
      className="bg-white rounded-card p-5 mb-3.5 border border-neutral-200 shadow-card"
    >
      {/* Date Header */}
      <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100">
        <View className="flex-row items-center">
          <Calendar size={16} color={colors.primary[600]} />
          <Text className="ml-2 text-sm font-bold font-sans text-neutral-900">{formattedDate}</Text>
        </View>
      </View>

      {/* Today's Work Section */}
      <View className="mb-3">
        <View className="flex-row items-center mb-1">
          <BookOpen size={14} color={colors.neutral[500]} />
          <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-600 uppercase tracking-wider">
            Worked on:
          </Text>
        </View>
        <Text
          className="text-sm font-sans text-neutral-800 leading-5"
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
          <Text className="ml-1.5 text-xs font-bold font-sans text-neutral-600 uppercase tracking-wider">
            Learned:
          </Text>
        </View>
        <Text
          className="text-sm font-sans text-neutral-800 leading-5"
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
