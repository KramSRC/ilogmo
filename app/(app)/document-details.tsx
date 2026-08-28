/**
 * iLogMo - Document Details Screen
 * Shows full document metadata, allows opening via secure signed URL, and deleting with confirmation.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  File,
  Trash2,
  Calendar,
  HardDrive,
  Folder,
  FileType,
} from 'lucide-react-native';
import {
  useDocuments,
  Document,
  formatFileSize,
  formatUploadDate,
  getFileTypeDetails,
  CATEGORY_LABELS,
} from '@/features/documents';
import { Button, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function DocumentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getDocumentById, openDocument, deleteDocument, isDeleting } = useDocuments();

  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDoc() {
      if (!id) {
        setIsLoading(false);
        setError('No document ID provided.');
        return;
      }

      setIsLoading(true);
      try {
        const doc = await getDocumentById(id);
        if (isMounted) {
          if (doc) {
            setDocument(doc);
          } else {
            setError('Could not find the requested document.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[DocumentDetailsScreen] Error loading document:', err);
          setError('Failed to load document details.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDoc();

    return () => {
      isMounted = false;
    };
  }, [id, getDocumentById]);

  const handleOpen = async () => {
    if (!document || isOpening) return;
    setIsOpening(true);
    try {
      await openDocument(document);
    } finally {
      setIsOpening(false);
    }
  };

  const handleDelete = () => {
    if (!document) return;

    Alert.alert(
      'Delete this document?',
      'This file will be permanently removed from your storage.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteDocument(document.id, document.storagePath);
            if (result.success) {
              Alert.alert('Success', 'Document deleted.', [
                {
                  text: 'OK',
                  onPress: () => {
                    router.back();
                  },
                },
              ]);
            } else {
              Alert.alert('Error', result.error || 'Unable to delete document.');
            }
          },
        },
      ]
    );
  };

  const fileDetails = document ? getFileTypeDetails(document.fileName, document.fileType) : null;

  const renderFileIcon = () => {
    if (!fileDetails) return null;
    switch (fileDetails.kind) {
      case 'pdf':
        return <FileText size={32} color={fileDetails.color} strokeWidth={2.2} />;
      case 'doc':
        return <FileText size={32} color={fileDetails.color} strokeWidth={2.2} />;
      case 'sheet':
        return <FileSpreadsheet size={32} color={fileDetails.color} strokeWidth={2.2} />;
      case 'slide':
        return <Presentation size={32} color={fileDetails.color} strokeWidth={2.2} />;
      case 'image':
        return <ImageIcon size={32} color={fileDetails.color} strokeWidth={2.2} />;
      default:
        return <File size={32} color={fileDetails.color} strokeWidth={2.2} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)/documents');
              }
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{ minHeight: 44, minWidth: 44 }}
            className="rounded-full bg-white dark:bg-neutral-900 items-center justify-center border border-neutral-200 dark:border-neutral-800 mr-3 shadow-soft-sm"
          >
            <ArrowLeft size={20} color={colors.neutral[700]} />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">Document Details</Text>
          </View>
        </View>

        {/* Delete Button in Header */}
        {document ? (
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Delete document"
            className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/40 items-center justify-center border border-red-100"
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Trash2 size={18} color="#EF4444" />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        className="px-5 pt-4"
      >
        {/* Loading State */}
        {isLoading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary[600]} />
            <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400 mt-3">
              Loading document details...
            </Text>
          </View>
        ) : error || !document ? (
          /* Error State */
          <View className="py-8">
            <ErrorMessage message={error || 'Document not found'} type="error" />
            <Button
              title="Go Back"
              onPress={() => router.back()}
              variant="outline"
              size="md"
              className="mt-4"
            />
          </View>
        ) : (
          <>
            {/* 1. Main Document Card */}
            <View className="bg-white dark:bg-neutral-900 rounded-card p-6 shadow-card border border-neutral-200 dark:border-neutral-800 mb-5 items-center text-center">
              {/* Large Icon Badge */}
              <View
                className={`w-20 h-20 rounded-3xl ${fileDetails?.bg} border items-center justify-center mb-4`}
              >
                {renderFileIcon()}
              </View>

              {/* Title */}
              <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100 text-center mb-2">
                {document.name}
              </Text>

              {/* Category Pill */}
              <View className="bg-primary-50 dark:bg-primary-900/40 px-3.5 py-1 rounded-full border border-primary-100 dark:border-primary-800/50 mb-2">
                <Text className="text-xs font-bold font-sans text-primary-700 dark:text-primary-300">
                  {CATEGORY_LABELS[document.category] || document.category}
                </Text>
              </View>

              {/* File Type & Size subtitle */}
              <Text className="text-xs font-medium font-sans text-neutral-400">
                {fileDetails?.badge} Document · {formatFileSize(document.fileSize)}
              </Text>
            </View>

            {/* 2. Metadata Specs Card */}
            <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card border border-neutral-200 dark:border-neutral-800 mb-5">
              <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-4">
                File Information
              </Text>

              {/* Category Row */}
              <View className="flex-row items-center py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <View className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 items-center justify-center mr-3 border border-neutral-100 dark:border-neutral-800">
                  <Folder size={15} color={colors.neutral[500]} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-sans text-neutral-400">Category</Text>
                  <Text className="text-sm font-medium font-sans text-neutral-800 dark:text-neutral-200 capitalize">
                    {CATEGORY_LABELS[document.category] || document.category}
                  </Text>
                </View>
              </View>

              {/* File Format */}
              <View className="flex-row items-center py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <View className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 items-center justify-center mr-3 border border-neutral-100 dark:border-neutral-800">
                  <FileType size={15} color={colors.neutral[500]} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-sans text-neutral-400">Format</Text>
                  <Text className="text-sm font-medium font-sans text-neutral-800 dark:text-neutral-200">
                    {fileDetails?.extension} ({document.fileName})
                  </Text>
                </View>
              </View>

              {/* File Size */}
              <View className="flex-row items-center py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <View className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 items-center justify-center mr-3 border border-neutral-100 dark:border-neutral-800">
                  <HardDrive size={15} color={colors.neutral[500]} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-sans text-neutral-400">File Size</Text>
                  <Text className="text-sm font-medium font-sans text-neutral-800 dark:text-neutral-200">
                    {formatFileSize(document.fileSize)}
                  </Text>
                </View>
              </View>

              {/* Uploaded Date */}
              <View className="flex-row items-center pt-2.5">
                <View className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 items-center justify-center mr-3 border border-neutral-100 dark:border-neutral-800">
                  <Calendar size={15} color={colors.neutral[500]} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-sans text-neutral-400">Uploaded</Text>
                  <Text className="text-sm font-medium font-sans text-neutral-800 dark:text-neutral-200">
                    {formatUploadDate(document.createdAt)}
                  </Text>
                </View>
              </View>
            </View>

            {/* 3. Description (If present) */}
            {document.description ? (
              <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card border border-neutral-200 dark:border-neutral-800 mb-6">
                <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-2">
                  Description
                </Text>
                <Text className="text-sm font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {document.description}
                </Text>
              </View>
            ) : null}

            {/* 4. Action Buttons */}
            <View className="space-y-3">
              <Button
                title="Open Document"
                isLoading={isOpening}
                loadingText="Opening..."
                onPress={handleOpen}
                variant="primary"
                size="lg"
                className="w-full shadow-button"
              />

              <Button
                title="Delete Document"
                isLoading={isDeleting}
                loadingText="Deleting..."
                onPress={handleDelete}
                variant="danger"
                size="lg"
                className="w-full mt-3"
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
