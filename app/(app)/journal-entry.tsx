/**
 * iLogMo - Create / Edit Journal Entry Screen
 * Handles form inputs, validation, OJT date range checking, and fresh form resets.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ArrowLeft, AlertCircle, BookOpen } from 'lucide-react-native';
import { useJournal, getTodayJournalDate, JournalEntry } from '@/features/journal';
import { Button, DatePickerInput, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function JournalEntryScreen() {
  const router = useRouter();
  const { id, date: initialDateParam } = useLocalSearchParams<{ id?: string; date?: string }>();
  const isEditing = Boolean(id);

  const { createEntry, updateEntry, getEntryById, getEntryByDate, validateOjtDate, isSaving } =
    useJournal();

  // Form State
  const [entryDate, setEntryDate] = useState<string>(initialDateParam || getTodayJournalDate());
  const [workDescription, setWorkDescription] = useState<string>('');
  const [learningDescription, setLearningDescription] = useState<string>('');
  const [challenges, setChallenges] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // UI / Validation State
  const [existingEntryOnDate, setExistingEntryOnDate] = useState<JournalEntry | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(isEditing);

  // Load existing entry if editing by ID
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    async function loadExisting() {
      setIsLoadingInitial(true);
      try {
        const entry = await getEntryById(id!);
        if (isMounted && entry) {
          setEntryDate(entry.entryDate);
          setWorkDescription(entry.workDescription);
          setLearningDescription(entry.learningDescription);
          setChallenges(entry.challenges || '');
          setNotes(entry.notes || '');
        } else if (isMounted) {
          setFormError('Could not find the requested journal entry.');
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[JournalEntryScreen] Error loading entry:', err);
          setFormError('Failed to load journal entry for editing.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingInitial(false);
        }
      }
    }

    loadExisting();

    return () => {
      isMounted = false;
    };
  }, [id, getEntryById]);

  // Reset form when screen gains focus in new entry mode
  useFocusEffect(
    useCallback(() => {
      if (!id) {
        setEntryDate(initialDateParam || getTodayJournalDate());
        setWorkDescription('');
        setLearningDescription('');
        setChallenges('');
        setNotes('');
        setErrors({});
        setFormError(null);
        setExistingEntryOnDate(null);
        setIsLoadingInitial(false);
      }
    }, [id, initialDateParam])
  );

  // Check if selected date already has an entry (when creating new)
  useEffect(() => {
    let isCancelled = false;

    async function checkDateDuplicate() {
      if (isEditing || !entryDate) {
        setExistingEntryOnDate(null);
        return;
      }

      try {
        const duplicate = await getEntryByDate(entryDate);
        if (!isCancelled) {
          if (duplicate) {
            setExistingEntryOnDate(duplicate);
          } else {
            setExistingEntryOnDate(null);
          }
        }
      } catch (err) {
        console.warn('[JournalEntryScreen] Error checking date duplicate:', err);
      }
    }

    checkDateDuplicate();

    return () => {
      isCancelled = true;
    };
  }, [entryDate, isEditing, getEntryByDate]);

  // Derive OJT Period warning
  const ojtWarning = useMemo(() => {
    if (!entryDate) return null;
    const ojtCheck = validateOjtDate(entryDate);
    return ojtCheck.warning || null;
  }, [entryDate, validateOjtDate]);

  // Handle Date Change
  const handleDateChange = (newDate: string) => {
    setEntryDate(newDate);
    setErrors((prev) => ({ ...prev, entryDate: '' }));
    setFormError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!entryDate) {
      newErrors.entryDate = 'Please select a valid date.';
    }

    const trimmedWork = workDescription.trim();
    if (!trimmedWork) {
      newErrors.workDescription = "Today's Work is required.";
    } else if (trimmedWork.length < 3) {
      newErrors.workDescription = "Today's Work must be at least 3 characters.";
    } else if (trimmedWork.length > 10000) {
      newErrors.workDescription = "Today's Work cannot exceed 10,000 characters.";
    }

    const trimmedLearning = learningDescription.trim();
    if (!trimmedLearning) {
      newErrors.learningDescription = 'What I Learned is required.';
    } else if (trimmedLearning.length < 3) {
      newErrors.learningDescription = 'What I Learned must be at least 3 characters.';
    } else if (trimmedLearning.length > 10000) {
      newErrors.learningDescription = 'What I Learned cannot exceed 10,000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isSaving) return;
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    if (isEditing && id) {
      // Update existing
      const result = await updateEntry(id, {
        entryDate,
        workDescription,
        learningDescription,
        challenges: challenges.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (result.success) {
        Alert.alert('Success', 'Journal entry updated.', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        setFormError(result.error || 'Unable to update your journal entry.');
      }
    } else {
      // Create new entry
      const result = await createEntry({
        entryDate,
        workDescription,
        learningDescription,
        challenges: challenges.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (result.success) {
        setWorkDescription('');
        setLearningDescription('');
        setChallenges('');
        setNotes('');
        Alert.alert('Success', 'Journal entry saved.', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        setFormError(result.error || 'Unable to save your journal entry.');
      }
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
                router.replace('/(app)/journal');
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
            <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
              {isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          className="px-5 pt-4"
        >
          {/* Top Form Error */}
          {formError ? (
            <View className="mb-4">
              <ErrorMessage message={formError} type="error" />
            </View>
          ) : null}

          {/* Existing Entry On Date Notice */}
          {existingEntryOnDate && !isEditing ? (
            <View className="mb-4 p-3.5 bg-blue-50 rounded-2xl border border-blue-200 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <BookOpen size={18} color={colors.primary[600]} />
                <View className="ml-2.5 flex-1">
                  <Text className="text-xs font-bold font-sans text-blue-900">
                    Previous Entry Found for {entryDate}
                  </Text>
                  <Text className="text-[11px] font-sans text-blue-700 leading-4">
                    You can edit your previous entry or fill out below to add another entry for
                    today.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  router.replace({
                    pathname: '/journal-entry',
                    params: { id: existingEntryOnDate.id },
                  });
                }}
                activeOpacity={0.7}
                className="bg-primary-600 px-3 py-2 rounded-xl"
              >
                <Text className="text-xs font-bold font-sans text-white">Edit Previous</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* OJT Date Warning */}
          {ojtWarning ? (
            <View className="mb-4 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex-row items-start">
              <AlertCircle size={18} color="#D97706" style={{ marginTop: 1 }} />
              <View className="ml-2.5 flex-1">
                <Text className="text-xs font-bold font-sans text-amber-900">
                  OJT Period Warning
                </Text>
                <Text className="text-xs font-sans text-amber-800 mt-0.5 leading-4">
                  {ojtWarning}
                </Text>
              </View>
            </View>
          ) : null}

          {/* 1. Date Field */}
          <View className="mb-4">
            <DatePickerInput
              label="Date *"
              value={entryDate}
              onChangeDate={handleDateChange}
              placeholder="Select date"
              error={errors.entryDate}
              disabled={isSaving || isLoadingInitial}
            />
          </View>

          {/* 2. Today's Work */}
          <View className="mb-4">
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-1.5">
              What did you work on? *
            </Text>
            <View
              className="bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border"
              style={[
                styles.inputWrapper,
                errors.workDescription ? styles.inputError : styles.inputNormal,
              ]}
            >
              <TextInput
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Describe the tasks or activities you worked on today..."
                placeholderTextColor={colors.neutral[400]}
                value={workDescription}
                onChangeText={(text) => {
                  setWorkDescription(text);
                  setErrors((prev) => ({ ...prev, workDescription: '' }));
                }}
                editable={!isSaving && !isLoadingInitial}
                className="text-base font-sans text-neutral-900 dark:text-neutral-100 min-h-[100px]"
              />
            </View>
            {errors.workDescription ? (
              <Text className="text-xs font-sans text-red-500 mt-1">{errors.workDescription}</Text>
            ) : null}
          </View>

          {/* 3. What I Learned */}
          <View className="mb-4">
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-1.5">
              What did you learn? *
            </Text>
            <View
              className="bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border"
              style={[
                styles.inputWrapper,
                errors.learningDescription ? styles.inputError : styles.inputNormal,
              ]}
            >
              <TextInput
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Describe something new you learned today..."
                placeholderTextColor={colors.neutral[400]}
                value={learningDescription}
                onChangeText={(text) => {
                  setLearningDescription(text);
                  setErrors((prev) => ({ ...prev, learningDescription: '' }));
                }}
                editable={!isSaving && !isLoadingInitial}
                className="text-base font-sans text-neutral-900 dark:text-neutral-100 min-h-[100px]"
              />
            </View>
            {errors.learningDescription ? (
              <Text className="text-xs font-sans text-red-500 mt-1">
                {errors.learningDescription}
              </Text>
            ) : null}
          </View>

          {/* 4. Challenges */}
          <View className="mb-4">
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-1.5">
              Challenges <Text className="text-neutral-400 font-normal">(Optional)</Text>
            </Text>
            <View className="bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border border-neutral-200 dark:border-neutral-800">
              <TextInput
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholder="Did you encounter any problems or difficulties?"
                placeholderTextColor={colors.neutral[400]}
                value={challenges}
                onChangeText={setChallenges}
                editable={!isSaving && !isLoadingInitial}
                className="text-base font-sans text-neutral-900 dark:text-neutral-100 min-h-[80px]"
              />
            </View>
          </View>

          {/* 5. Additional Notes */}
          <View className="mb-6">
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-1.5">
              Additional Notes <Text className="text-neutral-400 font-normal">(Optional)</Text>
            </Text>
            <View className="bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border border-neutral-200 dark:border-neutral-800">
              <TextInput
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholder="Anything else you want to remember..."
                placeholderTextColor={colors.neutral[400]}
                value={notes}
                onChangeText={setNotes}
                editable={!isSaving && !isLoadingInitial}
                className="text-base font-sans text-neutral-900 dark:text-neutral-100 min-h-[80px]"
              />
            </View>
          </View>

          {/* 6. Save Button */}
          <Button
            title={isEditing ? 'Save Changes' : 'Save Entry'}
            isLoading={isSaving}
            loadingText="Saving..."
            onPress={handleSave}
            variant="primary"
            size="lg"
            className="w-full shadow-button"
            disabled={isSaving || isLoadingInitial}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: '#FFFFFF',
  },
  inputNormal: {
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#EF4444',
  },
});
