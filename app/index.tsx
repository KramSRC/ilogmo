import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { authService } from '@/features/auth/services/authService';
import { ojtService } from '@/features/ojt/services/ojtService';
import { colors } from '@/constants/colors';

export default function SplashScreen() {
  const router = useRouter();
  const { setSession, setUser, setProfile, setLoading } = useAuthStore();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    // 1. Trigger subtle upward entrance animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Check Supabase Auth Session
    let isMounted = true;

    async function checkAuthSession() {
      try {
        const session = await authService.getInitialSession();

        if (session?.user) {
          setSession(session);
          setUser(session.user);

          // Fetch profile & active OJT asynchronously
          const [profile, ojt] = await Promise.all([
            authService.fetchProfile(session.user.id),
            ojtService.getActiveOjt(session.user.id),
          ]);

          if (profile) {
            setProfile(profile);
          }

          useOjtStore.getState().setActiveOjt(ojt);

          setLoading(false);

          // Graceful transition delay
          setTimeout(() => {
            if (isMounted) {
              if (ojt) {
                router.replace('/(app)');
              } else {
                router.replace('/(onboarding)/ojt-setup');
              }
            }
          }, 350);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);

          setTimeout(() => {
            if (isMounted) {
              router.replace('/(auth)/login');
            }
          }, 350);
        }
      } catch (error) {
        console.warn('[SplashScreen] Session check error:', error);
        setLoading(false);
        if (isMounted) {
          router.replace('/(auth)/login');
        }
      }
    }

    checkAuthSession();

    return () => {
      isMounted = false;
    };
  }, [opacity, translateY, router, setSession, setUser, setProfile, setLoading]);

  return (
    <View className="flex-1 bg-background-app dark:bg-neutral-950 items-center justify-center px-6">
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
        }}
        className="items-center justify-center"
      >
        {/* Brand Icon Container */}
        <View className="w-20 h-20 rounded-3xl bg-primary-600 items-center justify-center shadow-card dark:shadow-none mb-5 border border-primary-500">
          <BookOpen size={38} color="#FFFFFF" strokeWidth={2.4} />
        </View>

        {/* Brand Title */}
        <Text className="text-3xl font-bold font-sans text-neutral-900 dark:text-neutral-100 tracking-tight text-center">
          iLog<Text className="text-primary-600">Mo</Text>
        </Text>

        {/* Subtitle */}
        <Text className="mt-2 text-base font-sans text-neutral-500 dark:text-neutral-400 text-center">
          OJT made simple.
        </Text>

        {/* Loading Indicator */}
        <View className="mt-8">
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      </Animated.View>
    </View>
  );
}
