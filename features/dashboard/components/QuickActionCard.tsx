import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, BookOpen, Calendar, FileText, Folder, CheckSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export interface QuickActionCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: 'attendance' | 'journal' | 'calendar' | 'reports' | 'documents' | 'tasks';
  route: string;
}

export function QuickActionCard({ title, subtitle, icon, route }: QuickActionCardProps) {
  const router = useRouter();

  let IconComponent = Clock;
  let iconColor: string = colors.primary[600];
  let iconBg = 'bg-primary-50 border-primary-100';

  if (icon === 'journal') {
    IconComponent = BookOpen;
    iconColor = '#4F46E5'; // Indigo
    iconBg = 'bg-indigo-50 border-indigo-100';
  } else if (icon === 'calendar') {
    IconComponent = Calendar;
    iconColor = colors.success.DEFAULT;
    iconBg = 'bg-emerald-50 border-emerald-100';
  } else if (icon === 'documents') {
    IconComponent = Folder;
    iconColor = '#0284C7'; // Sky blue
    iconBg = 'bg-sky-50 border-sky-100';
  } else if (icon === 'reports') {
    IconComponent = FileText;
    iconColor = '#8B5CF6'; // Violet
    iconBg = 'bg-purple-50 border-purple-100';
  } else if (icon === 'tasks') {
    IconComponent = CheckSquare;
    iconColor = '#F59E0B'; // Amber
    iconBg = 'bg-amber-50 border-amber-100';
  }

  return (
    <TouchableOpacity
      onPress={() => router.push(route as any)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
      className="flex-1 bg-white dark:bg-neutral-900 rounded-card p-4 shadow-card border border-neutral-200 dark:border-neutral-800 min-h-[118px] justify-between"
    >
      <View className={`w-10 h-10 rounded-2xl ${iconBg} border items-center justify-center mb-3`}>
        <IconComponent size={20} color={iconColor} strokeWidth={2.2} />
      </View>
      <View>
        <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100 leading-tight">{title}</Text>
        <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default QuickActionCard;
