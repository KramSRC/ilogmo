import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FileText, ArrowLeft } from 'lucide-react-native';

export default function ReportsScreen() {
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
        <ArrowLeft size={20} color="#475569" />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center -mt-16">
        <View className="bg-white rounded-card p-8 shadow-card border border-neutral-200 w-full max-w-sm items-center">
          <View className="w-16 h-16 bg-purple-50 rounded-3xl items-center justify-center mb-4 border border-purple-100">
            <FileText size={32} color="#8B5CF6" />
          </View>
          <Text className="text-xl font-bold font-sans text-neutral-900 text-center mb-1.5">
            OJT Reports
          </Text>
          <Text className="text-sm font-sans text-neutral-500 text-center leading-5">
            Weekly logbook generation, supervisor signatures, and PDF export coming in future steps.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
