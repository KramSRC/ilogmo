import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Calendar, FileText, ChevronRight } from 'lucide-react-native';
import { UpcomingReminder } from '../types';
import { colors } from '@/constants/colors';

export interface ReminderCardProps {
  reminder: UpcomingReminder | null;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const router = useRouter();

  if (!reminder) return null;

  let IconComponent = Bell;
  if (reminder.icon === 'calendar') IconComponent = Calendar;
  if (reminder.icon === 'file') IconComponent = FileText;

  return (
    <TouchableOpacity
      onPress={() => router.push('/(app)/reports')}
      activeOpacity={0.85}
      className="bg-amber-50 rounded-card p-4 border border-amber-200 mb-8 flex-row items-center justify-between"
    >
      <View className="flex-row items-center flex-1 mr-2">
        <View className="w-10 h-10 rounded-2xl bg-amber-100 items-center justify-center mr-3 border border-amber-200">
          <IconComponent size={18} color={colors.warning.dark} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-[11px] font-bold font-sans text-amber-800 uppercase tracking-wider mr-2">
              {reminder.timing}
            </Text>
          </View>
          <Text className="text-sm font-bold font-sans text-amber-950 mt-0.5" numberOfLines={1}>
            {reminder.title}
          </Text>
          {reminder.description ? (
            <Text className="text-xs font-sans text-amber-800/80 mt-0.5" numberOfLines={1}>
              {reminder.description}
            </Text>
          ) : null}
        </View>
      </View>

      <ChevronRight size={16} color={colors.warning.dark} />
    </TouchableOpacity>
  );
}

export default ReminderCard;
