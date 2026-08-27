/**
 * iLogMo - CustomBottomTabBar Component
 * Bottom navigation with 4 primary tabs (Home, Attendance, Journal, Tasks) and a far-right Menu button (☰ / ✕).
 * Seamlessly integrates with FloatingNavMenu, useRouter, and respects safe area insets and child route hiding.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Clock, BookOpen, CheckSquare, Menu, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { FloatingNavMenu } from './FloatingNavMenu';

interface TabItemConfig {
  name: string;
  label: string;
  icon: (color: string, size: number) => React.ReactNode;
}

const PRIMARY_TABS: TabItemConfig[] = [
  {
    name: 'index',
    label: 'Home',
    icon: (c, s) => <House size={s} color={c} />,
  },
  {
    name: 'attendance',
    label: 'Attendance',
    icon: (c, s) => <Clock size={s} color={c} />,
  },
  {
    name: 'journal',
    label: 'Journal',
    icon: (c, s) => <BookOpen size={s} color={c} />,
  },
  {
    name: 'tasks',
    label: 'Tasks',
    icon: (c, s) => <CheckSquare size={s} color={c} />,
  },
];

const MENU_ROUTE_NAMES = ['analytics', 'documents', 'reports', 'profile', 'settings'];

export function CustomBottomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentRoute = state.routes[state.index];
  const currentDescriptor = descriptors[currentRoute.key];
  const tabBarStyle = currentDescriptor?.options?.tabBarStyle;

  // If active screen requested tab bar hidden (e.g. sub-screens like upload, edit, details), return null
  if (tabBarStyle?.display === 'none') {
    return null;
  }

  const bottomInset = Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : Math.max(insets.bottom, 8);
  const barHeight = (Platform.OS === 'ios' ? 56 : 60) + bottomInset;

  const isMenuDestinationActive = MENU_ROUTE_NAMES.includes(currentRoute.name);

  const handleTabPress = (routeName: string) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }

    const isFocused = currentRoute.name === routeName;
    const event = navigation.emit({
      type: 'tabPress',
      target: currentRoute.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      if (routeName === 'index') {
        router.navigate('/(app)');
      } else {
        router.navigate(`/(app)/${routeName}` as any);
      }
    }
  };

  const handleMenuNavigate = (route: string) => {
    setIsMenuOpen(false);
    router.push(route as any);
  };

  return (
    <>
      {/* Floating Navigation Menu anchored above the tab bar */}
      <FloatingNavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleMenuNavigate}
        bottomOffset={barHeight}
      />

      {/* Primary Bottom Navigation Bar */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.neutral[200],
          borderTopWidth: 1,
          height: barHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          elevation: 8,
          shadowColor: colors.neutral[900],
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        }}
        className="flex-row items-center justify-around px-2"
      >
        {/* 4 Primary Navigation Tabs */}
        {PRIMARY_TABS.map((tab) => {
          const isFocused = currentRoute.name === tab.name;
          const activeColor = colors.primary[600];
          const inactiveColor = colors.neutral[400];
          const iconColor = isFocused ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={tab.label}
              style={{ minHeight: 44 }}
              className="flex-1 items-center justify-center py-1"
            >
              <View className="mb-0.5">{tab.icon(iconColor, 21)}</View>
              <Text
                style={{
                  fontFamily: isFocused ? 'Inter_600SemiBold' : 'Inter_500Medium',
                  fontSize: 10.5,
                  color: iconColor,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* 5th Item: Far-Right Menu Button (Icon Only, No Text Label) */}
        <TouchableOpacity
          onPress={() => setIsMenuOpen((prev) => !prev)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={isMenuOpen ? 'Close menu' : 'Open menu'}
          style={{ minHeight: 44, minWidth: 48 }}
          className="flex-1 items-center justify-center py-1"
        >
          <View
            style={[
              (isMenuOpen || isMenuDestinationActive) && {
                backgroundColor: '#EFF6FF',
                borderColor: colors.primary[200],
              },
            ]}
            className={`w-9 h-9 rounded-xl items-center justify-center ${
              isMenuOpen || isMenuDestinationActive ? 'border bg-primary-50' : ''
            }`}
          >
            {isMenuOpen ? (
              <X size={21} color={colors.primary[600]} strokeWidth={2.4} />
            ) : (
              <Menu
                size={22}
                color={isMenuDestinationActive ? colors.primary[600] : colors.neutral[700]}
                strokeWidth={2.2}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default CustomBottomTabBar;
