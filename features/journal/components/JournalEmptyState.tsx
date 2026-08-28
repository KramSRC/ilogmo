/**
 * iLogMo - Journal Empty State Component
 * Displayed when the user has no recorded journal entries yet.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { BookOpen, Plus } from 'lucide-react-native';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

export interface JournalEmptyStateProps {
  onCreateEntry: () => void;
}

export function JournalEmptyState({ onCreateEntry }: JournalEmptyStateProps) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-8 border border-neutral-200 dark:border-neutral-800 shadow-card dark:shadow-none items-center my-6">
      <View className="w-16 h-16 bg-primary-50 dark:bg-primary-900/40 rounded-3xl items-center justify-center mb-4 border border-primary-100 dark:border-primary-800/50">
        <BookOpen size={30} color={colors.primary[600]} />
      </View>

      <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100 text-center mb-2">
        Start your OJT journal
      </Text>

      <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400 text-center leading-5 mb-6 max-w-xs">
        Record what you worked on and what you learned each day.
      </Text>

      <Button
        title="Create First Entry"
        onPress={onCreateEntry}
        variant="primary"
        size="md"
        leftIcon={<Plus size={18} color="#FFFFFF" />}
        className="w-full"
      />
    </View>
  );
}

export default JournalEmptyState;
