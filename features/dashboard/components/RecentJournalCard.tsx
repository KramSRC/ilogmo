import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, PenLine, Sparkles } from 'lucide-react-native';
import { RecentJournal } from '../types';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

export interface RecentJournalCardProps {
  journal: RecentJournal | null;
}

export function RecentJournalCard({ journal }: RecentJournalCardProps) {
  const router = useRouter();

  return (
    <View className="mb-6">
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Recent Journal</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/journal')}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="flex-row items-center"
        >
          <Text className="text-xs font-semibold font-sans text-primary-600 mr-0.5">View All</Text>
          <ChevronRight size={14} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Content Card */}
      {journal ? (
        <TouchableOpacity
          onPress={() => router.push('/(app)/journal')}
          activeOpacity={0.85}
          className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800"
        >
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center">
              <View className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 items-center justify-center mr-2 border border-indigo-100 dark:border-indigo-800/50">
                <BookOpen size={14} color="#4F46E5" />
              </View>
              <Text className="text-xs font-bold font-sans text-neutral-700 dark:text-neutral-300">{journal.date}</Text>
            </View>
            {journal.mood ? (
              <View className="bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-100 flex-row items-center">
                <Sparkles size={11} color={colors.success.DEFAULT} />
                <Text className="ml-1 text-[11px] font-semibold font-sans text-emerald-700 dark:text-emerald-300 capitalize">
                  {journal.mood}
                </Text>
              </View>
            ) : null}
          </View>

          <Text className="text-sm font-sans text-neutral-600 dark:text-neutral-400 leading-5" numberOfLines={2}>
            "{journal.preview}"
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="bg-white dark:bg-neutral-900 rounded-card p-6 shadow-card dark:shadow-none border border-neutral-200 dark:border-neutral-800 items-center text-center">
          <View className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-3">
            <PenLine size={22} color={colors.neutral[500]} />
          </View>
          <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-1">
            No journal entries yet
          </Text>
          <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mb-4 text-center">
            Record your daily learnings and reflections.
          </Text>
          <Button
            title="Write Today's Journal"
            onPress={() => router.push('/(app)/journal-entry')}
            variant="outline"
            size="sm"
            className="w-full"
          />
        </View>
      )}
    </View>
  );
}

export default RecentJournalCard;
