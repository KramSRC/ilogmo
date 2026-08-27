import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen } from 'lucide-react-native';

export default function JournalScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-app items-center justify-center px-6">
      <View className="bg-white rounded-card p-8 shadow-card border border-neutral-200 w-full max-w-sm items-center">
        <View className="w-16 h-16 bg-indigo-50 rounded-3xl items-center justify-center mb-4 border border-indigo-100">
          <BookOpen size={32} color="#4F46E5" />
        </View>
        <Text className="text-xl font-bold font-sans text-neutral-900 text-center mb-1.5">
          Daily Journal
        </Text>
        <Text className="text-sm font-sans text-neutral-500 text-center leading-5">
          Daily log entries, reflection prompts, and supervisor reviews coming in the Journal step.
        </Text>
      </View>
    </SafeAreaView>
  );
}
