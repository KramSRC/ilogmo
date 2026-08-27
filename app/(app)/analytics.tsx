import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-app items-center justify-center px-6">
      <View className="bg-white rounded-card p-8 shadow-card border border-neutral-200 w-full max-w-sm items-center">
        <View className="w-16 h-16 bg-blue-50 rounded-3xl items-center justify-center mb-4 border border-blue-100">
          <BarChart3 size={32} color={colors.primary[600]} />
        </View>
        <Text className="text-xl font-bold font-sans text-neutral-900 text-center mb-1.5">
          OJT Analytics
        </Text>
        <Text className="text-sm font-sans text-neutral-500 text-center leading-5">
          Detailed completion breakdown, weekly hour distributions, and pace forecasts coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
