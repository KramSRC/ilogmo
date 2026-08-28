import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
} from 'lucide-react-native';
import { ojtSetupSchema, OjtSetupFormData } from '@/features/ojt/validation';
import { useOjt } from '@/features/ojt/hooks/useOjt';
import { WorkingDay } from '@/features/ojt/types';
import { Button, Input, DatePickerInput, TimePickerInput, ErrorMessage } from '@/components';
import { getTodayDateString } from '@/features/attendance/utils/timeUtils';
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

export default function OjtSetupScreen() {
  const router = useRouter();
  const { createOjt, isSubmitting } = useOjt();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const todayStr = getTodayDateString();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OjtSetupFormData>({
    resolver: zodResolver(ojtSetupSchema),
    defaultValues: {
      requiredHours: 486,
      startDate: todayStr,
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

  const onSubmit = async (data: OjtSetupFormData) => {
    setServerError(null);

    const result = await createOjt({
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
      setServerError(result.error || 'Unable to save your OJT setup. Please try again.');
    } else {
      setIsSuccess(true);
      timeoutRef.current = setTimeout(() => {
        router.replace('/(app)');
      }, 900);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950 justify-center items-center px-6">
        <View className="bg-white dark:bg-neutral-900 rounded-card p-8 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent w-full max-w-sm items-center">
          <View className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/40 rounded-3xl items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800/50">
            <CheckCircle2 size={32} color={colors.success.DEFAULT} strokeWidth={2.5} />
          </View>
          <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 text-center mb-1.5">
            You're all set! 🎉
          </Text>
          <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400 text-center leading-5 mb-2">
            Your OJT configuration has been saved.
          </Text>
          <Text className="text-xs font-sans text-primary-600 text-center font-medium">
            Redirecting to your dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-5 pt-4"
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
              Set up your OJT
            </Text>
            <Text className="mt-1 text-sm font-sans text-neutral-500 dark:text-neutral-400 leading-5">
              Tell us about your internship so iLogMo can track your progress accurately.
            </Text>
          </View>

          {/* Server Error Alert */}
          {serverError ? (
            <ErrorMessage
              message={serverError}
              type="error"
              onDismiss={() => setServerError(null)}
              className="mb-5"
            />
          ) : null}

          {/* ========================================================================= */}
          {/* SECTION 1: OJT Requirements */}
          {/* ========================================================================= */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-5">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              OJT Requirements
            </Text>

            {/* Required Hours */}
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
                  helperText="Enter the total number of hours required by your school."
                  leftIcon={<Clock size={18} color={colors.neutral[400]} />}
                  containerClassName="mb-4"
                />
              )}
            />

            {/* Start Date Picker */}
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

            {/* Expected End Date Picker */}
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
                  helperText="Optional. Leave blank if flexible."
                />
              )}
            />
          </View>

          {/* ========================================================================= */}
          {/* SECTION 2: Internship Details */}
          {/* ========================================================================= */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-5">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              Internship Details
            </Text>

            {/* Company Name */}
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

            {/* Department */}
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

            {/* Supervisor Name */}
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

            {/* Company Address */}
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

          {/* ========================================================================= */}
          {/* SECTION 3: OJT Schedule */}
          {/* ========================================================================= */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-5 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent mb-6">
            <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              OJT Schedule
            </Text>

            {/* Working Days Selector Controller */}
            <Controller
              control={control}
              name="workingDays"
              render={({ field: { value: selectedDays, onChange } }) => {
                const DAY_ORDER: Record<WorkingDay, number> = {
                  Monday: 1,
                  Tuesday: 2,
                  Wednesday: 3,
                  Thursday: 4,
                  Friday: 5,
                  Saturday: 6,
                  Sunday: 7,
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
                    <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mb-3">
                      Select your regular scheduled internship days:
                    </Text>

                    {/* 7-Day Pill Buttons Grid */}
                    <View className="flex-row justify-between">
                      {ALL_DAYS.map((item) => {
                        const isSelected = selectedDays?.includes(item.day);
                        return (
                          <TouchableOpacity
                            key={item.day}
                            onPress={() => toggleDay(item.day)}
                            activeOpacity={0.75}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: isSelected }}
                            accessibilityLabel={`${item.day} working day`}
                            style={{ minHeight: 44 }}
                            className={`flex-1 mx-0.5 items-center justify-center py-2 rounded-xl border ${
                              isSelected
                                ? 'bg-primary-600 border-primary-600'
                                : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-transparent'
                            }`}
                          >
                            <Text
                              className={`text-[11px] font-bold font-sans ${
                                isSelected ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'
                              }`}
                              numberOfLines={1}
                            >
                              {item.label}
                            </Text>
                            {isSelected ? (
                              <Check
                                size={10}
                                color="#FFFFFF"
                                strokeWidth={3}
                                style={{ marginTop: 2 }}
                              />
                            ) : null}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {errors.workingDays ? (
                      <Text className="text-xs text-error font-sans mt-2">
                        {errors.workingDays.message}
                      </Text>
                    ) : null}
                  </View>
                );
              }}
            />

            {/* Expected Start Time & End Time Pickers */}
            <View className="flex-row space-x-3">
              <View className="flex-1 mr-2">
                <Controller
                  control={control}
                  name="expectedStartTime"
                  render={({ field: { onChange, value } }) => (
                    <TimePickerInput
                      label="Start Time"
                      value={value}
                      onChangeTime={onChange}
                      clearable
                      error={errors.expectedStartTime?.message}
                    />
                  )}
                />
              </View>

              <View className="flex-1 ml-2">
                <Controller
                  control={control}
                  name="expectedEndTime"
                  render={({ field: { onChange, value } }) => (
                    <TimePickerInput
                      label="End Time"
                      value={value}
                      onChangeTime={onChange}
                      clearable
                      error={errors.expectedEndTime?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            title="Complete OJT Setup"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            loadingText="Saving OJT Setup..."
            variant="primary"
            size="lg"
            className="w-full mb-6 shadow-soft-sm dark:shadow-none"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
