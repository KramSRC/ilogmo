import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Clock,
  Building2,
  Briefcase,
  User,
  MapPin,
  Check,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react-native';
import { ojtSetupSchema, OjtSetupFormData } from '@/features/ojt/validation';
import { useOjt } from '@/features/ojt/hooks/useOjt';
import { WorkingDay } from '@/features/ojt/types';
import { Button, Input, DatePickerInput, TimePickerInput, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

const ALL_DAYS: { day: WorkingDay; label: string; short: string }[] = [
  { day: 'Monday', label: 'Mon', short: 'M' },
  { day: 'Tuesday', label: 'Tue', short: 'T' },
  { day: 'Wednesday', label: 'Wed', short: 'W' },
  { day: 'Thursday', label: 'Thu', short: 'T' },
  { day: 'Friday', label: 'Fri', short: 'F' },
  { day: 'Saturday', label: 'Sat', short: 'S' },
  { day: 'Sunday', label: 'Sun', short: 'S' },
];

export default function EditOjtScreen() {
  const router = useRouter();
  const { activeOjt, updateOjt, isSubmitting } = useOjt();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsSuccess(false);
      setServerError(null);
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }, [])
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<OjtSetupFormData>({
    resolver: zodResolver(ojtSetupSchema),
    defaultValues: {
      requiredHours: 486,
      startDate: '',
      expectedEndDate: '',
      companyName: '',
      department: '',
      supervisorName: '',
      companyAddress: '',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      expectedStartTime: '08:00',
      expectedEndTime: '17:00',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (activeOjt) {
      reset({
        requiredHours: activeOjt.requiredHours,
        startDate: activeOjt.startDate,
        expectedEndDate: activeOjt.expectedEndDate || '',
        companyName: activeOjt.companyName,
        department: activeOjt.department,
        supervisorName: activeOjt.supervisorName || '',
        companyAddress: activeOjt.companyAddress || '',
        workingDays: activeOjt.workingDays,
        expectedStartTime: activeOjt.expectedStartTime || '',
        expectedEndTime: activeOjt.expectedEndTime || '',
      });
    }
  }, [activeOjt, reset]);

  const onSubmit = async (data: OjtSetupFormData) => {
    if (!activeOjt) return;
    setServerError(null);

    const result = await updateOjt(activeOjt.id, {
      requiredHours: Number(data.requiredHours),
      startDate: data.startDate,
      expectedEndDate: data.expectedEndDate || undefined,
      companyName: data.companyName,
      department: data.department,
      supervisorName: data.supervisorName || undefined,
      companyAddress: data.companyAddress || undefined,
      workingDays: data.workingDays,
      expectedStartTime: data.expectedStartTime || undefined,
      expectedEndTime: data.expectedEndTime || undefined,
    });

    if (!result.success) {
      setServerError(result.error || 'Unable to update your OJT setup. Please try again.');
    } else {
      setIsSuccess(true);
      timeoutRef.current = setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(app)/profile');
        }
      }, 900);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950 justify-center items-center px-6">
        <View className="bg-white dark:bg-neutral-900 rounded-card p-8 shadow-card border border-neutral-200 dark:border-neutral-800 w-full max-w-sm items-center">
          <View className="w-16 h-16 bg-emerald-50 rounded-3xl items-center justify-center mb-4 border border-emerald-100">
            <CheckCircle2 size={32} color={colors.success.DEFAULT} strokeWidth={2.5} />
          </View>
          <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 text-center mb-1.5">
            Updated! 🎉
          </Text>
          <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400 text-center leading-5 mb-2">
            Your OJT information has been updated.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View className="flex-row items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)/profile');
              }
            }}
            className="p-2 -ml-2 rounded-full active:bg-neutral-100 min-h-[44px] min-w-[44px] items-center justify-center"
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <ArrowLeft size={24} color={colors.neutral[800]} />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100 ml-2">
            Edit OJT Details
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-5 pt-4"
        >
          {serverError ? (
            <ErrorMessage
              message={serverError}
              type="error"
              onDismiss={() => setServerError(null)}
              className="mb-5"
            />
          ) : null}

          {/* SECTION 1: OJT Requirements */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card border border-neutral-200 dark:border-neutral-800 mb-5">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              OJT Requirements
            </Text>

            <Controller
              control={control}
              name="requiredHours"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Required OJT Hours *"
                  placeholder="e.g. 486"
                  keyboardType="numeric"
                  value={value ? String(value) : ''}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                  onBlur={onBlur}
                  error={errors.requiredHours?.message}
                  leftIcon={<Clock size={18} color={colors.neutral[400]} />}
                  containerClassName="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  label="OJT Start Date *"
                  value={value}
                  onChangeDate={onChange}
                  error={errors.startDate?.message}
                  containerClassName="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="expectedEndDate"
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  label="Expected End Date"
                  value={value}
                  onChangeDate={onChange}
                  placeholder="Select expected end date (Optional)"
                  clearable
                  error={errors.expectedEndDate?.message}
                />
              )}
            />
          </View>

          {/* SECTION 2: Internship Details */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card border border-neutral-200 dark:border-neutral-800 mb-5">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              Internship Details
            </Text>

            <Controller
              control={control}
              name="companyName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Company Name *"
                  placeholder="e.g. ABC Technologies Inc."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.companyName?.message}
                  leftIcon={<Building2 size={18} color={colors.neutral[400]} />}
                  containerClassName="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="department"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Department *"
                  placeholder="e.g. IT & Software Development"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.department?.message}
                  leftIcon={<Briefcase size={18} color={colors.neutral[400]} />}
                  containerClassName="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="supervisorName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Supervisor Name"
                  placeholder="e.g. Juan Dela Cruz (Optional)"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.supervisorName?.message}
                  leftIcon={<User size={18} color={colors.neutral[400]} />}
                  containerClassName="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="companyAddress"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Company Address"
                  placeholder="e.g. Cebu City, Philippines (Optional)"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={2}
                  error={errors.companyAddress?.message}
                  leftIcon={<MapPin size={18} color={colors.neutral[400]} />}
                />
              )}
            />
          </View>

          {/* SECTION 3: OJT Schedule */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card border border-neutral-200 dark:border-neutral-800 mb-6">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              OJT Schedule
            </Text>

            <Controller
              control={control}
              name="workingDays"
              render={({ field: { value: selectedDays, onChange } }) => {
                const DAY_ORDER: Record<WorkingDay, number> = {
                  Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7,
                };
                const toggleDay = (day: WorkingDay) => {
                  const current = [...(selectedDays || [])];
                  const index = current.indexOf(day);
                  let updated: WorkingDay[];
                  if (index !== -1) {
                    if (current.length > 1) {
                      current.splice(index, 1);
                      updated = current;
                    } else {
                      updated = current;
                    }
                  } else {
                    updated = [...current, day];
                  }
                  updated.sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]);
                  onChange(updated);
                };
                return (
                  <View className="mb-4">
                    <Text className="text-xs font-semibold font-sans text-neutral-700 dark:text-neutral-300 mb-2">
                      Working Days *
                    </Text>
                    <View className="flex-row justify-between">
                      {ALL_DAYS.map((item) => {
                        const isSelected = selectedDays?.includes(item.day);
                        return (
                          <TouchableOpacity
                            key={item.day}
                            onPress={() => toggleDay(item.day)}
                            activeOpacity={0.75}
                            style={{ minHeight: 44 }}
                            className={`flex-1 mx-0.5 items-center justify-center py-2 rounded-xl border ${
                              isSelected ? 'bg-primary-600 border-primary-600' : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                            }`}
                          >
                            <Text className={`text-[11px] font-bold font-sans ${isSelected ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'}`} numberOfLines={1}>
                              {item.label}
                            </Text>
                            {isSelected ? <Check size={10} color="#FFFFFF" strokeWidth={3} style={{ marginTop: 2 }} /> : null}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {errors.workingDays ? <Text className="text-xs text-error font-sans mt-2">{errors.workingDays.message}</Text> : null}
                  </View>
                );
              }}
            />

            <View className="flex-row space-x-3">
              <View className="flex-1 mr-2">
                <Controller
                  control={control}
                  name="expectedStartTime"
                  render={({ field: { onChange, value } }) => (
                    <TimePickerInput label="Start Time" value={value} onChangeTime={onChange} clearable error={errors.expectedStartTime?.message} />
                  )}
                />
              </View>
              <View className="flex-1 ml-2">
                <Controller
                  control={control}
                  name="expectedEndTime"
                  render={({ field: { onChange, value } }) => (
                    <TimePickerInput label="End Time" value={value} onChangeTime={onChange} clearable error={errors.expectedEndTime?.message} />
                  )}
                />
              </View>
            </View>
          </View>

          <Button
            title="Save Changes"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            disabled={!isDirty}
            loadingText="Saving..."
            variant="primary"
            size="lg"
            className="w-full mb-6 shadow-soft-sm"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
