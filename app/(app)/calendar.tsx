import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function CalendarScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-app px-6 pt-4">
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="w-10 h-10 rounded-full bg-white items-center justify-center border border-neutral-200 shadow-soft-sm mb-6"
      >
        <ArrowLeft size={20} color={colors.neutral[700]} />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center -mt-16">
        <View className="bg-white rounded-card p-8 shadow-card border border-neutral-200 w-full max-w-sm items-center">
          <View className="w-16 h-16 bg-emerald-50 rounded-3xl items-center justify-center mb-4 border border-emerald-100">
            <Calendar size={32} color={colors.success.DEFAULT} />
          </View>
          <Text className="text-xl font-bold font-sans text-neutral-900 text-center mb-1.5">
            OJT Calendar
          </Text>
          <Text className="text-sm font-sans text-neutral-500 text-center leading-5">
            Shift scheduling, holidays, and milestones calendar coming soon.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
