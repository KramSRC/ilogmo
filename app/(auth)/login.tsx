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
import { Mail } from 'lucide-react-native';
import { loginSchema, LoginFormData } from '@/features/auth/validation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { ojtService } from '@/features/ojt/services/ojtService';
import { useOjtStore } from '@/store/ojtStore';
import { Button, Input, PasswordInput, Logo, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isSubmitting } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const result = await login({
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      setServerError(result.error || 'Unable to sign in. Please try again.');
    } else {
      const loggedUser = result.data?.user || useAuthStore.getState().user;
      const ojt = loggedUser ? await ojtService.getActiveOjt(loggedUser.id) : null;
      useOjtStore.getState().setActiveOjt(ojt);

      if (ojt) {
        router.replace('/(app)');
      } else {
        router.replace('/(onboarding)/ojt-setup');
      }
    }
  };

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
          {/* Brand Header */}
          <View className="items-center mb-8">
            <Logo size="md" showSubtitle={false} />
            <Text className="mt-6 text-2xl font-bold font-sans text-neutral-900 tracking-tight text-center">
              Welcome back
            </Text>
            <Text className="mt-1.5 text-sm font-sans text-neutral-500 text-center">
              Sign in to continue tracking your OJT.
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
                  placeholder="Enter your password"
                  autoComplete="password"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  containerClassName="mb-2"
                />
              )}
            />

            {/* Forgot Password Link */}
            <View className="flex-row justify-end mb-6">
              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text className="text-sm font-medium font-sans text-primary-600">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              loadingText="Signing in..."
              variant="primary"
              size="md"
            />
          </View>

          {/* Bottom Footer: Create Account Link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-sm font-sans text-neutral-500">Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-sm font-semibold font-sans text-primary-600">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
