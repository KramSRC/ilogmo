/**
 * iLogMo - Journal Entry Details Screen
 * Displays complete journal entry details with Edit and Delete actions.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  FileText,
  Edit2,
  Trash2,
} from 'lucide-react-native';
import { useJournal, JournalEntry } from '@/features/journal';
import { formatJournalDate } from '@/features/journal/utils/journalUtils';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

export default function JournalDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getEntryById, deleteEntry, isDeleting } = useJournal();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load entry
  useEffect(() => {
    async function load() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getEntryById(id);
        setEntry(data);
      } catch (err) {
        console.warn('[JournalDetailsScreen] Error loading entry:', err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id, getEntryById]);

  const handleEdit = () => {
    if (!entry) return;
    router.push({
      pathname: '/journal-entry',
      params: { id: entry.id },
    });
  };

  const handleDelete = () => {
    if (!entry) return;

    Alert.alert('Delete this journal entry?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteEntry(entry.id);
          if (result.success) {
            Alert.alert('Success', 'Journal entry deleted.', [
              {
                text: 'OK',
                onPress: () => {
                  router.back();
                },
              },
            ]);
          } else {
            Alert.alert('Error', result.error || 'Unable to delete journal entry.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 bg-white">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="w-10 h-10 rounded-full bg-white items-center justify-center border border-neutral-200 mr-3"
          >
            <ArrowLeft size={20} color={colors.neutral[700]} />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-xl font-bold font-sans text-neutral-900">Journal Details</Text>
          </View>
        </View>

        {/* Quick Edit Action in Header */}
        {entry && !isLoading ? (
          <TouchableOpacity
            onPress={handleEdit}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center border border-primary-100"
          >
            <Edit2 size={18} color={colors.primary[600]} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      ) : !entry ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-bold font-sans text-neutral-800">Entry Not Found</Text>
          <Text className="text-xs font-sans text-neutral-500 mt-1 text-center">
            The requested journal entry could not be located.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
            size="sm"
            className="mt-4"
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          className="px-5 pt-4"
        >
          {/* Date Summary Card */}
          <View className="bg-white rounded-card p-5 border border-neutral-200 shadow-card mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center border border-primary-100 mr-3.5">
                <Calendar size={22} color={colors.primary[600]} />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-wider">
                  Journal Date
                </Text>
                <Text className="text-lg font-bold font-sans text-neutral-900">
                  {formatJournalDate(entry.entryDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Today's Work Card */}
          <View className="bg-white rounded-card p-5 border border-neutral-200 shadow-card mb-4">
            <View className="flex-row items-center pb-2.5 mb-3 border-b border-neutral-100">
              <BookOpen size={16} color={colors.primary[600]} />
              <Text className="ml-2 text-sm font-bold font-sans text-neutral-900">
                Today&apos;s Work
              </Text>
            </View>
            <Text className="text-base font-sans text-neutral-800 leading-6 whitespace-pre-wrap">
              {entry.workDescription}
            </Text>
          </View>

          {/* What I Learned Card */}
          <View className="bg-white rounded-card p-5 border border-neutral-200 shadow-card mb-4">
            <View className="flex-row items-center pb-2.5 mb-3 border-b border-neutral-100">
              <Lightbulb size={16} color={colors.warning.DEFAULT} />
              <Text className="ml-2 text-sm font-bold font-sans text-neutral-900">
                What I Learned
              </Text>
            </View>
            <Text className="text-base font-sans text-neutral-800 leading-6 whitespace-pre-wrap">
              {entry.learningDescription}
            </Text>
          </View>

          {/* Challenges Card (if any) */}
          {entry.challenges ? (
            <View className="bg-white rounded-card p-5 border border-neutral-200 shadow-card mb-4">
              <View className="flex-row items-center pb-2.5 mb-3 border-b border-neutral-100">
                <AlertTriangle size={16} color={colors.error.DEFAULT} />
                <Text className="ml-2 text-sm font-bold font-sans text-neutral-900">
                  Challenges
                </Text>
              </View>
              <Text className="text-base font-sans text-neutral-800 leading-6 whitespace-pre-wrap">
                {entry.challenges}
              </Text>
            </View>
          ) : null}

          {/* Additional Notes Card (if any) */}
          {entry.notes ? (
            <View className="bg-white rounded-card p-5 border border-neutral-200 shadow-card mb-4">
              <View className="flex-row items-center pb-2.5 mb-3 border-b border-neutral-100">
                <FileText size={16} color={colors.neutral[600]} />
                <Text className="ml-2 text-sm font-bold font-sans text-neutral-900">
                  Additional Notes
                </Text>
              </View>
              <Text className="text-base font-sans text-neutral-800 leading-6 whitespace-pre-wrap">
                {entry.notes}
              </Text>
            </View>
          ) : null}

          {/* Bottom Actions */}
          <View className="flex-row items-center space-x-3 mt-4">
            <View className="flex-1">
              <Button
                title="Edit Entry"
                onPress={handleEdit}
                variant="primary"
                size="md"
                leftIcon={<Edit2 size={16} color="#FFFFFF" />}
              />
            </View>

            <View className="flex-1 ml-3">
              <Button
                title="Delete Entry"
                onPress={handleDelete}
                variant="danger"
                size="md"
                isLoading={isDeleting}
                loadingText="Deleting..."
                leftIcon={<Trash2 size={16} color="#FFFFFF" />}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
