/**
 * iLogMo - CustomBottomTabBar Component
 * High-fidelity separated bottom navigation system:
 * 1. Rounded navigation pill with 4 primary destinations (Home, Attendance, Journal, Tasks).
 * 2. Completely separate floating circular More button (••• / ×) with visible gap.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Clock, BookOpen, CheckSquare, Ellipsis, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
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
  const isDark = useThemeStore((state) => state.isDark);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentRoute = state.routes[state.index];
  const currentDescriptor = descriptors[currentRoute.key];
  const tabBarStyle = currentDescriptor?.options?.tabBarStyle;

  // If active screen requested tab bar hidden (e.g. sub-screens like upload, edit, details), return null
  if (tabBarStyle?.display === 'none') {
    return null;
  }

  // Safe bottom offset ensuring healthy breathing room above home indicators
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 18 : 14) + 6;
  const isMenuDestinationActive = MENU_ROUTE_NAMES.includes(currentRoute.name);
  const isMoreActive = isMenuOpen || isMenuDestinationActive;

  const BAR_HEIGHT = 62;

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
      {/* Floating Navigation Menu anchored directly above the More button */}
      <FloatingNavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleMenuNavigate}
        bottomOffset={BAR_HEIGHT + bottomInset}
      />

      {/* Floating Separated Bottom Navigation Container */}
      <View
        style={{
          position: 'absolute',
          bottom: bottomInset,
          left: 14,
          right: 14,
          pointerEvents: 'box-none',
        }}
        className="flex-row items-center justify-between"
      >
        {/* 1. Rounded Navigation Pill (4 Primary Destinations) */}
        <View
          style={{
            height: BAR_HEIGHT,
            backgroundColor: isDark ? '#171717' : '#FFFFFF',
            borderRadius: BAR_HEIGHT / 2,
            borderWidth: 1,
            borderColor: isDark ? '#262626' : 'rgba(226, 232, 240, 0.95)',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.35 : 0.09,
            shadowRadius: 14,
            elevation: 8,
          }}
          className="flex-1 flex-row items-center justify-around px-1.5 mr-2.5"
        >
          {PRIMARY_TABS.map((tab) => {
            const isFocused = currentRoute.name === tab.name;
            const activeColor = colors.primary[500];
            const inactiveColor = isDark ? colors.neutral[500] : colors.neutral[400];
            const iconColor = isFocused ? activeColor : inactiveColor;

            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => handleTabPress(tab.name)}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={tab.label}
                style={{ height: '100%' }}
                className="flex-1 items-center justify-center py-1"
              >
                <View className="items-center justify-center">
                  <View className="mb-0.5">{tab.icon(iconColor, 20)}</View>
                  <Text
                    style={{
                      fontFamily: isFocused ? 'Inter_600SemiBold' : 'Inter_500Medium',
                      fontSize: 10,
                      color: iconColor,
                    }}
                  >
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2. Completely Separate Floating Circular More Button (••• / ×) */}
        <TouchableOpacity
          onPress={() => setIsMenuOpen((prev) => !prev)}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={isMenuOpen ? 'Close menu' : 'Open more menu'}
          style={{
            width: BAR_HEIGHT,
            height: BAR_HEIGHT,
            borderRadius: BAR_HEIGHT / 2,
            backgroundColor: isMoreActive
              ? isDark
                ? 'rgba(37, 99, 235, 0.25)'
                : '#EFF6FF'
              : isDark
                ? '#171717'
                : '#FFFFFF',
            borderWidth: 1,
            borderColor: isMoreActive
              ? colors.primary[400]
              : isDark
                ? '#1E293B'
                : 'rgba(226, 232, 240, 0.95)',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.35 : 0.1,
            shadowRadius: 14,
            elevation: 8,
          }}
          className="items-center justify-center"
        >
          {isMenuOpen ? (
            <X size={23} color={colors.primary[500]} strokeWidth={2.4} />
          ) : (
            <Ellipsis
              size={23}
              color={
                isMenuDestinationActive
                  ? colors.primary[500]
                  : isDark
                    ? colors.neutral[300]
                    : colors.neutral[700]
              }
              strokeWidth={2.2}
            />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

export default CustomBottomTabBar;
