import '../global.css';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/features/auth/services/authService';
import { colors } from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { setSession, setUser, setProfile, logout, isAuthenticated, isLoading } = useAuthStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // 1. Configure transparent Android status bar & hide native splash screen once fonts are loaded
  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor('transparent');
      RNStatusBar.setBarStyle('dark-content');
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 2. Set up global Supabase auth state listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_IN' && currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        const profile = await authService.ensureProfile(currentSession.user);
        if (profile) {
          setProfile(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        logout();
      } else if (event === 'PASSWORD_RECOVERY') {
        // Deep linked from reset password email
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
        router.push('/(auth)/reset-password');
      } else if (event === 'TOKEN_REFRESHED' && currentSession) {
        setSession(currentSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setProfile, logout, router]);

  // 3. Global Route Guard: Protect (app) from unauthenticated access
  useEffect(() => {
    if (isLoading || !fontsLoaded) return;

    const inAppGroup = segments[0] === '(app)';

    if (!isAuthenticated && inAppGroup) {
      // Redirect to login if user is not authenticated and trying to view (app)
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, segments, fontsLoaded, router]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background.app,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background.app,
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
