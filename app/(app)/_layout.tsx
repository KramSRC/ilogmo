import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Platform } from 'react-native';
import { House, Clock, BookOpen, BarChart3, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useOjtStore } from '@/store/ojtStore';
import { colors } from '@/constants/colors';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { hasCompletedSetup } = useOjtStore();

  if (!isLoading) {
    if (!isAuthenticated) {
      return <Redirect href="/(auth)/login" />;
    }
    if (!hasCompletedSetup) {
      return <Redirect href="/(onboarding)/ojt-setup" />;
    }
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.neutral[200],
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 8,
          shadowColor: colors.neutral[900],
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      {/* 1. Home Tab (Default) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size ?? 22} color={color} />,
        }}
      />

      {/* 2. Attendance Tab */}
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => <Clock size={size ?? 22} color={color} />,
        }}
      />

      {/* 3. Journal Tab */}
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => <BookOpen size={size ?? 22} color={color} />,
        }}
      />

      {/* 4. Analytics Tab */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size ?? 22} color={color} />,
        }}
      />

      {/* 5. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size ?? 22} color={color} />,
        }}
      />

      {/* Secondary Screens (Hidden from Tab Bar) */}
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="attendance-history"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="attendance-details"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
