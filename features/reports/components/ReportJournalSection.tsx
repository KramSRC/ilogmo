/**
 * iLogMo - ReportJournalSection Component
 * Formal summary card for Total Journal Entries, Logs this Week/Month, Latest log date, and Documents count.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, FileText } from 'lucide-react-native';
import { ReportJournalSummary } from '../types';
import { colors } from '@/constants/colors';

export interface ReportJournalSectionProps {
  journal: ReportJournalSummary;
  documentsCount: number;
}

export function ReportJournalSection({ journal, documentsCount }: ReportJournalSectionProps) {
  const router = useRouter();
  const hasEntries = journal.totalEntries > 0;

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 items-center justify-center mr-2.5">
            <BookOpen size={16} color="#8B5CF6" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Journal Summary</Text>
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Reflective logs & records</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(app)/journal')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="View journal entries"
          style={{ minHeight: 44 }}
          className="flex-row items-center justify-center px-2 py-1 -mr-2"
        >
          <Text className="text-xs font-bold font-sans text-primary-600 mr-0.5">Journal</Text>
          <ChevronRight size={14} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {!hasEntries ? (
        <View className="py-4 items-center justify-center">
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 text-center">
            No journal entries yet.
          </Text>
        </View>
      ) : (
        <>
          {/* 3 Metrics Row */}
          <View className="flex-row justify-between mb-3">
            <View className="flex-1 mr-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 items-center">
              <Text className="text-[10.5px] font-semibold font-sans text-neutral-500 dark:text-neutral-400 uppercase">
                Total Logs
              </Text>
              <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-0.5">
                {journal.totalEntries}
              </Text>
            </View>

            <View className="flex-1 mx-0.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 items-center">
              <Text className="text-[10.5px] font-semibold font-sans text-neutral-500 dark:text-neutral-400 uppercase">
                This Week
              </Text>
              <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-0.5">
                {journal.entriesThisWeek}
              </Text>
            </View>

            <View className="flex-1 ml-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 items-center">
              <Text className="text-[10.5px] font-semibold font-sans text-neutral-500 dark:text-neutral-400 uppercase">
                This Month
              </Text>
              <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-0.5">
                {journal.entriesThisMonth}
              </Text>
            </View>
          </View>

          {/* Latest Entry Row */}
          <View className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-3 flex-row items-center justify-between mb-2">
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Latest Journal Entry</Text>
            <Text className="text-xs font-semibold font-sans text-neutral-900 dark:text-neutral-100">
              {journal.latestEntryDateFormatted || 'None'}
            </Text>
          </View>
        </>
      )}

      {/* Documents Uploaded Meta Count */}
      <TouchableOpacity
        onPress={() => router.push('/(app)/documents')}
        activeOpacity={0.7}
        className="flex-row items-center justify-between pt-2.5 mt-1 border-t border-neutral-100 dark:border-neutral-800"
      >
        <View className="flex-row items-center">
          <FileText size={14} color={colors.neutral[400]} />
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 ml-1.5">Documents Uploaded</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-xs font-bold font-sans text-neutral-800 dark:text-neutral-200 mr-1">
            {documentsCount} file{documentsCount === 1 ? '' : 's'}
          </Text>
          <ChevronRight size={13} color={colors.neutral[400]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default ReportJournalSection;
