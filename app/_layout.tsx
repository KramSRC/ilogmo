import '../global.css';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
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
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { authService } from '@/features/auth/services/authService';
import { ojtService } from '@/features/ojt/services/ojtService';
import { colors } from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  // 2. Set up global Supabase auth state listener (using getState() to prevent root re-renders)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_IN' && currentSession?.user) {
        useAuthStore.getState().setSession(currentSession);
        useAuthStore.getState().setUser(currentSession.user);
        const profile = await authService.ensureProfile(currentSession.user);
        if (profile) {
          useAuthStore.getState().setProfile(profile);
        }
        const ojt = await ojtService.getActiveOjt(currentSession.user.id);
        useOjtStore.getState().setActiveOjt(ojt);
      } else if (event === 'SIGNED_OUT') {
        useAuthStore.getState().logout();
        useOjtStore.getState().clearOjt();
      } else if (event === 'PASSWORD_RECOVERY') {
        if (currentSession?.user) {
          useAuthStore.getState().setSession(currentSession);
          useAuthStore.getState().setUser(currentSession.user);
        }
      } else if (event === 'TOKEN_REFRESHED' && currentSession) {
        useAuthStore.getState().setSession(currentSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3. Handle incoming deep link recovery tokens
  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;
      try {
        const hashIdx = url.indexOf('#');
        const queryIdx = url.indexOf('?');
        const searchStr =
          hashIdx !== -1
            ? url.substring(hashIdx + 1)
            : queryIdx !== -1
              ? url.substring(queryIdx + 1)
              : '';

        if (searchStr) {
          const params: Record<string, string> = {};
          searchStr.split('&').forEach((pair) => {
            const [k, v] = pair.split('=');
            if (k && v) params[decodeURIComponent(k)] = decodeURIComponent(v);
          });

          if (params.access_token && params.refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });

            if (!error && data.session) {
              useAuthStore.getState().setSession(data.session);
              useAuthStore.getState().setUser(data.session.user);
            }
          }
        }
      } catch (err) {
        console.warn('[RootLayout] Deep link handling error:', err);
      }
    };

    Linking.getInitialURL().then(handleUrl);
    const sub = Linking.addEventListener('url', (event) => handleUrl(event.url));

    return () => {
      sub.remove();
    };
  }, []);

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
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
