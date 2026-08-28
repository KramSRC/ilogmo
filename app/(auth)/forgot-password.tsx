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
import { ArrowLeft, Mail, MailCheck } from 'lucide-react-native';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/features/auth/validation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button, Input, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { requestPasswordReset, isSubmitting } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    const result = await requestPasswordReset(data.email);

    if (!result.success) {
      setServerError(result.error || 'Failed to send reset email. Please try again.');
    } else {
      setIsEmailSent(true);
    }
  };

  // Success Confirmation Card
  if (isEmailSent) {
    return (
      <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950 justify-center items-center px-6">
        <View className="bg-white dark:bg-neutral-900 rounded-card p-8 shadow-card border border-neutral-200 dark:border-neutral-800 w-full max-w-sm items-center">
          <View className="w-16 h-16 bg-blue-50 rounded-3xl items-center justify-center mb-5 border border-blue-100">
            <MailCheck size={32} color={colors.primary[600]} />
          </View>

          <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 text-center mb-2">
            Check your email
          </Text>

          <Text className="text-sm font-sans text-neutral-500 dark:text-neutral-400 text-center leading-5 mb-6">
            We sent a password reset link to your email address. Please check your inbox and spam
            folder.
          </Text>

          <Button
            title="Back to Sign In"
            onPress={() => router.replace('/(auth)/login')}
            variant="primary"
            className="w-full"
          />
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-6 py-6"
        >
          {/* Back Button */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Back to Sign In"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 items-center justify-center border border-neutral-200 dark:border-neutral-800 shadow-soft-sm"
            >
              <ArrowLeft size={20} color={colors.neutral[700]} />
            </TouchableOpacity>
          </View>

          {/* Heading */}
          <View className="mb-6">
            <Text className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight">
              Forgot your password?
            </Text>
            <Text className="mt-1.5 text-sm font-sans text-neutral-500 dark:text-neutral-400 leading-5">
              Enter your email and we'll send you a link to reset your password.
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white dark:bg-neutral-900 rounded-card p-6 shadow-card border border-neutral-200 dark:border-neutral-800">
            {/* Server Error Alert */}
            {serverError ? (
              <ErrorMessage
                message={serverError}
                type="error"
                onDismiss={() => setServerError(null)}
                className="mb-4"
              />
            ) : null}

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
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Submit Button */}
            <Button
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              loadingText="Sending link..."
              variant="primary"
              size="md"
            />
          </View>

          {/* Back to Sign In Link */}
          <View className="items-center justify-center mt-8">
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-sm font-semibold font-sans text-primary-600">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
