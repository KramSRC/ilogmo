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
import { Button, ErrorMessage } from '@/components';
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
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
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
            <Text className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
              Journal
            </Text>
            <Text className="text-xs font-sans text-neutral-500 mt-0.5">
              Record your OJT experience
            </Text>
          </View>

          {/* New Entry Button */}
          <TouchableOpacity
            onPress={handleCreateNew}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Create new journal entry"
            className="flex-row items-center bg-primary-600 px-4 py-2.5 rounded-xl shadow-soft-sm min-h-[44px]"
          >
            <Plus size={16} color="#FFFFFF" />
            <Text className="text-sm font-semibold font-sans text-white ml-1.5">New Entry</Text>
          </TouchableOpacity>
        </View>

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
              <Text className="text-base font-bold font-sans text-neutral-900">Recent Entries</Text>
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
