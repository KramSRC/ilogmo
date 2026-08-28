/**
 * iLogMo - FloatingNavMenu Component
 * Floating secondary navigation panel anchored above the far-right Menu button.
 * Includes Analytics, Documents, Reports, Profile, and Settings with smooth entrance animation.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  BackHandler,
  Dimensions,
  Platform,
} from 'react-native';
import {
  BarChart3,
  Folder,
  FileText,
  User,
  Settings,
  ChevronRight,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

export interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: (color: string) => React.ReactNode;
  iconColor: string;
  iconBg: string;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'View your OJT progress',
    icon: (c) => <BarChart3 size={18} color={c} />,
    iconColor: colors.primary[600],
    iconBg: 'bg-primary-50 border-primary-100',
    route: '/(app)/analytics',
  },
  {
    id: 'documents',
    title: 'Documents',
    subtitle: 'Manage your OJT documents',
    icon: (c) => <Folder size={18} color={c} />,
    iconColor: '#0284C7', // Sky blue
    iconBg: 'bg-sky-50 border-sky-100',
    route: '/(app)/documents',
  },
  {
    id: 'reports',
    title: 'Reports',
    subtitle: 'View and export OJT reports',
    icon: (c) => <FileText size={18} color={c} />,
    iconColor: '#8B5CF6', // Purple
    iconBg: 'bg-purple-50 border-purple-100',
    route: '/(app)/reports',
  },
  {
    id: 'profile',
    title: 'Profile',
    subtitle: 'Manage your personal information',
    icon: (c) => <User size={18} color={c} />,
    iconColor: '#059669', // Emerald
    iconBg: 'bg-emerald-50 border-emerald-100',
    route: '/(app)/profile',
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'Manage app preferences',
    icon: (c) => <Settings size={18} color={c} />,
    iconColor: colors.neutral[600],
    iconBg: 'bg-neutral-100 border-neutral-200 dark:border-neutral-800',
    route: '/(app)/settings',
  },
];

export interface FloatingNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  bottomOffset: number;
}

export function FloatingNavMenu({
  isOpen,
  onClose,
  onNavigate,
  bottomOffset,
}: FloatingNavMenuProps) {
  const isDark = useThemeStore((state) => state.isDark);
  const animValue = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = React.useState(isOpen);

  // Handle hardware back button on Android
  useEffect(() => {
    if (!isOpen) return;

    const onBackPress = () => {
      onClose();
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isOpen, onClose]);

  // Handle smooth entrance/exit animation
  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      Animated.parallel([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        setRendered(false);
      });
    }
  }, [isOpen, animValue]);

  if (!rendered) return null;

  const screenWidth = Dimensions.get('window').width;
  const panelWidth = Math.min(270, screenWidth - 28);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        elevation: 9999,
      }}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      {/* Backdrop overlay */}
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Close menu overlay">
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0F172A',
            opacity: backdropOpacity,
          }}
        />
      </TouchableWithoutFeedback>

      {/* Floating Menu Panel */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: bottomOffset + 10,
          right: 14,
          width: panelWidth,
          opacity,
          transform: [{ translateY }],
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderColor: isDark ? '#1E293B' : '#E2E8F0',
          borderWidth: 1,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.4 : 0.16,
          shadowRadius: 16,
          elevation: 12,
        }}
        className="rounded-3xl overflow-hidden"
      >
        <View className="p-2">
          {MENU_ITEMS.map((item, index) => {
            const isLast = index === MENU_ITEMS.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  onClose();
                  onNavigate(item.route);
                }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${item.subtitle}`}
                style={{ minHeight: 52 }}
                className={`flex-row items-center px-3 py-2.5 rounded-2xl active:bg-neutral-100 dark:active:bg-neutral-800 ${
                  isLast ? '' : 'mb-0.5'
                }`}
              >
                {/* Icon Container */}
                <View
                  className={`w-9 h-9 rounded-xl ${item.iconBg} border items-center justify-center mr-3`}
                >
                  {item.icon(item.iconColor)}
                </View>

                {/* Text Content */}
                <View className="flex-1 mr-1">
                  <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100 leading-tight">
                    {item.title}
                  </Text>
                  <Text
                    className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight"
                    numberOfLines={1}
                  >
                    {item.subtitle}
                  </Text>
                </View>

                <ChevronRight size={15} color={isDark ? colors.neutral[600] : colors.neutral[300]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

export default FloatingNavMenu;
