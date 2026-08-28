/**
 * iLogMo - AboutModal Component
 * Displays app metadata, developer details, tech stack, and license notes.
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Info, Code2, Layers, Heart, Award } from 'lucide-react-native';
import Constants from 'expo-constants';
import { Button, Logo } from '@/components';
import { colors } from '@/constants/colors';

export interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutModal({ visible, onClose }: AboutModalProps) {
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-6 border-t border-neutral-200 dark:border-neutral-800 max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3.5 border-b border-neutral-100 dark:border-neutral-800 mb-4">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/40 items-center justify-center mr-3 border border-primary-100 dark:border-primary-800/50">
                <Info size={20} color={colors.primary[600]} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100">About iLogMo</Text>
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">
                  OJT Hours & Experience Tracker
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close about modal"
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
            >
              <X size={18} color={colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
            {/* App Brand Summary */}
            <View className="items-center py-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 mb-4">
              <Logo size="md" />
              <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-2">iLogMo</Text>
              <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 text-center px-4 mt-1">
                A mobile application designed to help students manage and track their OJT experience.
              </Text>
              <View className="bg-primary-50 dark:bg-primary-900/40 px-3 py-1 rounded-full border border-primary-200 mt-2">
                <Text className="text-[11px] font-bold font-sans text-primary-700 dark:text-primary-300">
                  Version {appVersion}
                </Text>
              </View>
            </View>

            {/* Information Sections */}
            <View className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 mb-4">
              {/* Developer */}
              <View className="flex-row items-center p-3.5">
                <View className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/40 items-center justify-center mr-3 border border-sky-100 dark:border-sky-800/50">
                  <Code2 size={16} color="#0284C7" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-sans text-neutral-400">Developer</Text>
                  <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200">
                    iLogMo Development Team
                  </Text>
                </View>
              </View>

              {/* Technology Stack */}
              <View className="flex-row items-center p-3.5">
                <View className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 items-center justify-center mr-3 border border-indigo-100 dark:border-indigo-800/50">
                  <Layers size={16} color="#4F46E5" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-sans text-neutral-400">Technology</Text>
                  <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200">
                    React Native · Expo · Supabase · NativeWind
                  </Text>
                </View>
              </View>

              {/* Open Source Licenses */}
              <View className="flex-row items-center p-3.5">
                <View className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 items-center justify-center mr-3 border border-amber-100">
                  <Award size={16} color="#D97706" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-sans text-neutral-400">Open Source Licenses</Text>
                  <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200">
                    MIT & Apache 2.0 Libraries
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer note */}
            <View className="flex-row items-center justify-center py-2">
              <Heart size={14} color={colors.primary[500]} />
              <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 ml-1.5">
                Built to empower trainees throughout their internship.
              </Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <Button
            title="Done"
            onPress={onClose}
            variant="primary"
            size="lg"
            className="w-full shadow-button dark:shadow-none"
          />
        </View>
      </View>
    </Modal>
  );
}

export default AboutModal;
