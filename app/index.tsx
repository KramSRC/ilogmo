import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50 justify-center items-center px-6">
      <View className="bg-white rounded-card p-6 shadow-card border border-neutral-200 w-full max-w-sm items-center">
        <View className="w-12 h-12 bg-primary-50 rounded-2xl items-center justify-center mb-4">
          <Text className="text-primary-600 font-bold text-xl">iL</Text>
        </View>
        <Text className="text-2xl font-bold text-neutral-900 mb-1 font-sans">iLogMo</Text>
        <Text className="text-sm text-neutral-500 text-center font-sans">
          Project initialized and configured successfully. Ready for feature implementation.
        </Text>
      </View>
    </SafeAreaView>
  );
}
