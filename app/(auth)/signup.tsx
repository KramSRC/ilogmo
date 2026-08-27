import React, { useState } from 'react';
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
import { ArrowLeft, User, IdCard, Mail, CheckCircle2 } from 'lucide-react-native';
import { signUpSchema, SignUpFormData } from '@/features/auth/validation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button, Input, PasswordInput, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function SignUpScreen() {
  const router = useRouter();
  const { signup, isSubmitting } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      studentId: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignUpFormData) => {
    setServerError(null);
    const result = await signup({
      firstName: data.firstName,
      lastName: data.lastName,
      studentId: data.studentId,
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      setServerError(result.error || 'Failed to create account. Please try again.');
    } else {
      setIsSuccess(true);
    }
  };

  // Success Confirmation Screen (for Email Confirmation or Direct Setup)
  if (isSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-background-app justify-center items-center px-6">
        <View className="bg-white rounded-card p-8 shadow-card border border-neutral-200 w-full max-w-sm items-center">
          <View className="w-16 h-16 bg-emerald-50 rounded-3xl items-center justify-center mb-5 border border-emerald-100">
            <CheckCircle2 size={32} color={colors.success.DEFAULT} />
          </View>
          <Text className="text-2xl font-bold font-sans text-neutral-900 text-center mb-2">
            Account Created!
          </Text>
          <Text className="text-sm font-sans text-neutral-500 text-center leading-5 mb-6">
            Your iLogMo account has been registered successfully. If your email requires
            confirmation, please verify it before logging in.
          </Text>
          <Button
            title="Proceed to Sign In"
            onPress={() => router.replace('/(auth)/login')}
            variant="primary"
            className="w-full"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-6 py-4"
        >
          {/* Header & Back Button */}
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Back to Sign In"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-10 h-10 rounded-full bg-white items-center justify-center border border-neutral-200 shadow-soft-sm mr-3"
            >
              <ArrowLeft size={20} color={colors.neutral[700]} />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
              Create your account
            </Text>
            <Text className="mt-1 text-sm font-sans text-neutral-500">
              Start tracking your OJT journey with iLogMo.
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-card p-6 shadow-card border border-neutral-200 mb-6">
            {/* Server Error Alert */}
            {serverError ? (
              <ErrorMessage
                message={serverError}
                type="error"
                onDismiss={() => setServerError(null)}
                className="mb-4"
              />
            ) : null}

            {/* Name Fields (Two Columns / Row) */}
            <View className="flex-row space-x-3 mb-4">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First Name"
                      placeholder="Juan"
                      autoCapitalize="words"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        if (serverError) setServerError(null);
                      }}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                      leftIcon={<User size={18} color={colors.neutral[400]} />}
                    />
                  )}
                />
              </View>

              <View className="flex-1 ml-3">
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last Name"
                      placeholder="Dela Cruz"
                      autoCapitalize="words"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        if (serverError) setServerError(null);
                      }}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
                    />
                  )}
                />
              </View>
            </View>

            {/* Student ID Field */}
            <Controller
              control={control}
              name="studentId"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Student ID"
                  placeholder="12345678"
                  autoCapitalize="characters"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={onBlur}
                  error={errors.studentId?.message}
                  leftIcon={<IdCard size={18} color={colors.neutral[400]} />}
                  containerClassName="mb-4"
                />
              )}
            />

            {/* Email Field */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="juandelacruz@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Mail size={18} color={colors.neutral[400]} />}
                  containerClassName="mb-4"
                />
              )}
            />

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Password"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  containerClassName="mb-4"
                />
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Create Account Button */}
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              loadingText="Creating account..."
              variant="primary"
              size="md"
            />
          </View>

          {/* Bottom Footer: Sign In Link */}
          <View className="flex-row items-center justify-center mb-8">
            <Text className="text-sm font-sans text-neutral-500">Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-sm font-semibold font-sans text-primary-600">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
