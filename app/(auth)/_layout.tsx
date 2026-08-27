import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { colors } from '@/constants/colors';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { hasCompletedSetup } = useOjtStore();

  if (!isLoading && isAuthenticated) {
    if (!hasCompletedSetup) {
      return <Redirect href="/(onboarding)/ojt-setup" />;
    }
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.app,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      <Stack.Screen name="signup" options={{ title: 'Create Account' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="reset-password" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}
