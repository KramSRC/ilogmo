import React from 'react';
import { Tabs } from 'expo-router';
import { House, Clock, BookOpen, CheckSquare } from 'lucide-react-native';
import { CustomBottomTabBar } from '@/components/navigation';
import { colors } from '@/constants/colors';

export default function AppLayout() {
  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
      }}
    >
      {/* ========================================================================= */}
      {/* 4 PRIMARY NAVIGATION TABS (Visible in Custom Bottom Bar) */}
      {/* ========================================================================= */}

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

      {/* 4. Tasks Tab */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <CheckSquare size={size ?? 22} color={color} />,
        }}
      />

      {/* ========================================================================= */}
      {/* SECONDARY / EXPANDABLE MENU & INNER SCREENS (Hidden from Bottom Bar) */}
      {/* ========================================================================= */}

      {/* Menu Item 1: Analytics */}
      <Tabs.Screen
        name="analytics"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      {/* Menu Item 2: Documents */}
      <Tabs.Screen
        name="documents"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      {/* Menu Item 3: Reports */}
      <Tabs.Screen
        name="reports"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      {/* Menu Item 4: Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      {/* Menu Item 5: Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      {/* Secondary Screens */}
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="attendance-history"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="attendance-details"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="journal-entry"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="journal-details"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="task-entry"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="task-details"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="document-upload"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="document-details"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="edit-ojt"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
