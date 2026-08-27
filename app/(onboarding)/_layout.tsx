import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { colors } from '@/constants/colors';

export default function OnboardingLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { hasCompletedSetup } = useOjtStore();

  if (!isLoading) {
    if (!isAuthenticated) {
      return <Redirect href="/(auth)/login" />;
    }
    if (hasCompletedSetup) {
      return <Redirect href="/(app)" />;
    }
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.app,
        },
      }}
    >
      <Stack.Screen name="ojt-setup" />
    </Stack>
  );
}
