/**
 * iLogMo - DocumentEmptyState Component
 * Empty state displayed when no documents match the active filter or no documents have been uploaded yet.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { FileUp, FolderOpen } from 'lucide-react-native';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

export interface DocumentEmptyStateProps {
  hasFilter?: boolean;
  onUploadPress: () => void;
  onClearFilter?: () => void;
}

export function DocumentEmptyState({
  hasFilter = false,
  onUploadPress,
  onClearFilter,
}: DocumentEmptyStateProps) {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-7 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent items-center text-center my-4">
      {/* Icon Circle */}
      <View className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800/50 items-center justify-center mb-4">
        {hasFilter ? (
          <FolderOpen size={26} color={colors.primary[600]} />
        ) : (
          <FileUp size={26} color={colors.primary[600]} />
        )}
      </View>

      {/* Title */}
      <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-1.5 text-center">
        {hasFilter ? 'No documents in this category' : 'Your documents will appear here.'}
      </Text>

      {/* Description */}
      <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 text-center leading-5 mb-5 px-3">
        {hasFilter
          ? 'There are currently no files under this category. Upload a document or select another category.'
          : 'Upload important OJT files so you can access them anytime.'}
      </Text>

      {/* Actions */}
      <View className="w-full flex-col space-y-2">
        <Button
          title="Upload Document"
          onPress={onUploadPress}
          variant="primary"
          size="md"
          className="w-full shadow-button dark:shadow-none"
        />
        {hasFilter && onClearFilter ? (
          <Button
            title="View All Documents"
            onPress={onClearFilter}
            variant="outline"
            size="md"
            className="w-full mt-2"
          />
        ) : null}
      </View>
    </View>
  );
}

export default DocumentEmptyState;
