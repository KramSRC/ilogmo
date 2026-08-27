/**
 * iLogMo - Documents List Screen
 * Displays student OJT documents, category filtering, upload trigger, and details navigation.
 */

import React from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useDocuments, Document } from '@/features/documents';
import {
  DocumentCard,
  DocumentCategoryFilter,
  DocumentEmptyState,
  DocumentSkeleton,
} from '@/features/documents/components';
import { Button, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function DocumentsScreen() {
  const router = useRouter();
  const {
    filteredDocuments,
    selectedCategory,
    categoryCounts,
    isLoading,
    isRefreshing,
    error,
    setSelectedCategory,
    refresh,
  } = useDocuments();

  const handleUploadPress = () => {
    router.push('/(app)/document-upload');
  };

  const handleSelectDocument = (doc: Document) => {
    router.push({
      pathname: '/(app)/document-details',
      params: { id: doc.id },
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
        <View className="flex-row items-center justify-between pb-3">
          <View className="flex-1 mr-3">
            <Text className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
              Documents
            </Text>
            <Text className="text-xs font-sans text-neutral-500 mt-0.5">
              Keep your OJT files organized
            </Text>
          </View>

          {/* Top Action: Upload Document */}
          <TouchableOpacity
            onPress={handleUploadPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Upload document"
            className="flex-row items-center bg-primary-600 px-3.5 py-2.5 rounded-xl shadow-soft-sm min-h-[44px]"
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text className="text-sm font-semibold font-sans text-white ml-1.5">Upload</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Category Filter Bar */}
        <DocumentCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* 3. Error Banner */}
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

        {/* 4. Documents Content */}
        {isLoading && !isRefreshing ? (
          <DocumentSkeleton />
        ) : filteredDocuments.length === 0 ? (
          <DocumentEmptyState
            hasFilter={selectedCategory !== 'all'}
            onUploadPress={handleUploadPress}
            onClearFilter={() => setSelectedCategory('all')}
          />
        ) : (
          <View className="mt-1">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-bold font-sans text-neutral-900">Your Documents</Text>
              <Text className="text-xs font-medium font-sans text-neutral-400">
                {filteredDocuments.length}{' '}
                {filteredDocuments.length === 1 ? 'document' : 'documents'}
              </Text>
            </View>

            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onPress={handleSelectDocument} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
