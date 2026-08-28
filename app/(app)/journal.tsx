/**
 * iLogMo - Journal Home Screen
 * Displays recent journal entries, action to create new entries, and empty/loading states.
 */

import React from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useJournal, JournalEntry } from '@/features/journal';
import { JournalCard, JournalEmptyState, JournalSkeleton } from '@/features/journal/components';
import { Button, ErrorMessage, NotificationBellButton } from '@/components';
import { colors } from '@/constants/colors';

export default function JournalScreen() {
  const router = useRouter();
  const { entries, isLoading, isRefreshing, error, refresh } = useJournal();

  const handleCreateNew = () => {
    router.push('/journal-entry');
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    router.push({
      pathname: '/journal-details',
      params: { id: entry.id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary[600]}
            colors={[colors.primary[600]]}
          />
        }
        className="px-5 pt-3"
      >
        {/* 1. Header Section */}
        <View className="flex-row items-center justify-between pb-4">
          <View className="flex-1 mr-3">
            <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
              Journal
            </Text>
            <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">
              Record your OJT experience
            </Text>
          </View>

          {/* Notification Bell */}
          <NotificationBellButton />
        </View>

        {/* 2. New Entry Action Button */}
        <TouchableOpacity
          onPress={handleCreateNew}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Write new journal entry"
          className="flex-row items-center justify-center bg-primary-600 py-3.5 px-4 rounded-2xl shadow-card dark:shadow-none mb-4 min-h-[48px]"
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-sm font-bold font-sans text-white ml-2">Write Journal Entry</Text>
        </TouchableOpacity>

        {/* 2. Error Display */}
        {error ? (
          <View className="mb-4">
            <ErrorMessage message={error} type="error" />
            <Button
              title="Try Again"
              onPress={refresh}
              variant="outline"
              size="sm"
              className="mt-2"
            />
          </View>
        ) : null}

        {/* 3. Loading Skeleton */}
        {isLoading && !isRefreshing ? (
          <JournalSkeleton />
        ) : entries.length === 0 ? (
          /* 4. Empty State */
          <JournalEmptyState onCreateEntry={handleCreateNew} />
        ) : (
          /* 5. Recent Entries List */
          <View className="mt-1">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Recent Entries</Text>
              <Text className="text-xs font-medium font-sans text-neutral-400">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>

            {entries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} onPress={handleSelectEntry} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
