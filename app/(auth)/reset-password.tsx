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
import { CheckCircle2, ArrowLeft } from 'lucide-react-native';
import { resetPasswordSchema, ResetPasswordFormData } from '@/features/auth/validation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button, PasswordInput, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isSubmitting } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(null);
    const result = await resetPassword(data.password);

    if (!result.success) {
      setServerError(result.error || 'Failed to update password. Please try again.');
    } else {
      setIsSuccess(true);
    }
  };

  // Success Confirmation Card
  if (isSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-background-app justify-center items-center px-6">
        <View className="bg-white rounded-card p-8 shadow-card border border-neutral-200 w-full max-w-sm items-center">
          <View className="w-16 h-16 bg-emerald-50 rounded-3xl items-center justify-center mb-5 border border-emerald-100">
            <CheckCircle2 size={32} color={colors.success.DEFAULT} />
          </View>

          <Text className="text-2xl font-bold font-sans text-neutral-900 text-center mb-2">
            Password Updated!
          </Text>

          <Text className="text-sm font-sans text-neutral-500 text-center leading-5 mb-6">
            Your password has been updated successfully. You can now sign in with your new
            credentials.
          </Text>

          <Button
            title="Return to Sign In"
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-6 py-6"
        >
          {/* Back Button */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              accessibilityRole="button"
              accessibilityLabel="Back to Sign In"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-10 h-10 rounded-full bg-white items-center justify-center border border-neutral-200 shadow-soft-sm"
            >
              <ArrowLeft size={20} color={colors.neutral[700]} />
            </TouchableOpacity>
          </View>

          {/* Heading */}
          <View className="mb-6">
            <Text className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
              Create a new password
            </Text>
            <Text className="mt-1.5 text-sm font-sans text-neutral-500 leading-5">
              Enter your new password below (at least 8 characters).
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-card p-6 shadow-card border border-neutral-200">
            {/* Server Error Alert */}
            {serverError ? (
              <ErrorMessage
                message={serverError}
                type="error"
                onDismiss={() => setServerError(null)}
                className="mb-4"
              />
            ) : null}

            {/* New Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
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
                  placeholder="Re-enter new password"
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

            {/* Update Password Button */}
            <Button
              title="Update Password"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              loadingText="Updating password..."
              variant="primary"
              size="md"
            />
          </View>

          {/* Back to Sign In */}
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
