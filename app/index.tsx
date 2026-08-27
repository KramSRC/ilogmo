import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { BookOpen } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/features/auth/services/authService';
import { colors } from '@/constants/colors';

export default function SplashScreen() {
  const router = useRouter();
  const { setSession, setUser, setProfile, setLoading } = useAuthStore();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    // 1. Trigger subtle upward entrance animation
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withSpring(0, {
      damping: 14,
      stiffness: 100,
    });

    // 2. Check Supabase Auth Session
    let isMounted = true;

    async function checkAuthSession() {
      try {
        const session = await authService.getInitialSession();

        if (session?.user) {
          setSession(session);
          setUser(session.user);

          // Fetch profile asynchronously
          const profile = await authService.fetchProfile(session.user.id);
          if (profile) {
            setProfile(profile);
          }

          setLoading(false);

          // Graceful transition delay
          setTimeout(() => {
            if (isMounted) {
              router.replace('/(app)/index');
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

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View className="flex-1 bg-background-app items-center justify-center px-6">
      <Animated.View style={animatedStyle} className="items-center justify-center">
        {/* Brand Icon Container */}
        <View className="w-20 h-20 rounded-3xl bg-primary-600 items-center justify-center shadow-card mb-5 border border-primary-500">
          <BookOpen size={38} color="#FFFFFF" strokeWidth={2.4} />
        </View>

        {/* Brand Title */}
        <Text className="text-3xl font-bold font-sans text-neutral-900 tracking-tight text-center">
          iLog<Text className="text-primary-600">Mo</Text>
        </Text>

        {/* Subtitle */}
        <Text className="mt-2 text-base font-sans text-neutral-500 text-center">
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
