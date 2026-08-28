/**
 * iLogMo - NotificationSettingsModal Component
 * Modal allowing students to configure their reminder preferences.
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { X, Clock, LogOut, CheckSquare, BookOpen, Award } from 'lucide-react-native';
import { NotificationSettings } from '../types';
import { colors } from '@/constants/colors';

export interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: NotificationSettings | null;
  onUpdateSetting: (key: keyof NotificationSettings, value: boolean) => void;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  userId: '',
  attendanceReminders: true,
  checkoutReminders: true,
  taskReminders: true,
  journalReminders: true,
  ojtReminders: true,
};

export function NotificationSettingsModal({
  visible,
  onClose,
  settings,
  onUpdateSetting,
}: NotificationSettingsModalProps) {
  const currentSettings = settings || DEFAULT_SETTINGS;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[85%] border-t border-neutral-200 dark:border-transparent">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100">
                Reminder Settings
              </Text>
              <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-0.5">
                Customize your OJT notification preferences
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close settings"
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
            >
              <X size={18} color={colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="space-y-4 mb-4">
            {/* 1. Attendance Reminder */}
            <View className="flex-row items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-900/40 border border-sky-100 dark:border-sky-800/50 items-center justify-center mr-3">
                  <Clock size={18} color="#0284C7" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold font-sans text-neutral-900 dark:text-neutral-100">
                    Attendance Reminders
                  </Text>
                  <Text className="text-xs font-sans text-neutral-400">
                    30 mins before scheduled start
                  </Text>
                </View>
              </View>
              <Switch
                value={currentSettings.attendanceReminders}
                onValueChange={(val) => onUpdateSetting('attendanceReminders', val)}
                trackColor={{ false: '#E2E8F0', true: colors.primary[600] }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 2. Check-Out Reminder */}
            <View className="flex-row items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/40 border border-amber-100 dark:border-amber-800/50 items-center justify-center mr-3">
                  <LogOut size={18} color="#D97706" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold font-sans text-neutral-900 dark:text-neutral-100">
                    Check-Out Reminders
                  </Text>
                  <Text className="text-xs font-sans text-neutral-400">
                    15 mins before scheduled end
                  </Text>
                </View>
              </View>
              <Switch
                value={currentSettings.checkoutReminders}
                onValueChange={(val) => onUpdateSetting('checkoutReminders', val)}
                trackColor={{ false: '#E2E8F0', true: colors.primary[600] }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 3. Task Reminders */}
            <View className="flex-row items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 items-center justify-center mr-3">
                  <CheckSquare size={18} color="#4F46E5" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold font-sans text-neutral-900 dark:text-neutral-100">
                    Task Reminders
                  </Text>
                  <Text className="text-xs font-sans text-neutral-400">
                    1 day before task due dates
                  </Text>
                </View>
              </View>
              <Switch
                value={currentSettings.taskReminders}
                onValueChange={(val) => onUpdateSetting('taskReminders', val)}
                trackColor={{ false: '#E2E8F0', true: colors.primary[600] }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 4. Journal Reminders */}
            <View className="flex-row items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50 items-center justify-center mr-3">
                  <BookOpen size={18} color="#16A34A" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold font-sans text-neutral-900 dark:text-neutral-100">
                    Journal Reminders
                  </Text>
                  <Text className="text-xs font-sans text-neutral-400">
                    30 mins after shift completion
                  </Text>
                </View>
              </View>
              <Switch
                value={currentSettings.journalReminders}
                onValueChange={(val) => onUpdateSetting('journalReminders', val)}
                trackColor={{ false: '#E2E8F0', true: colors.primary[600] }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 5. OJT Milestones */}
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 dark:border-purple-800/50 items-center justify-center mr-3">
                  <Award size={18} color="#9333EA" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold font-sans text-neutral-900 dark:text-neutral-100">
                    OJT Reminders
                  </Text>
                  <Text className="text-xs font-sans text-neutral-400">
                    Start dates and milestone alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={currentSettings.ojtReminders}
                onValueChange={(val) => onUpdateSetting('ojtReminders', val)}
                trackColor={{ false: '#E2E8F0', true: colors.primary[600] }}
                thumbColor="#FFFFFF"
              />
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            className="bg-neutral-900 py-3.5 rounded-xl items-center"
          >
            <Text className="text-sm font-semibold font-sans text-white">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default NotificationSettingsModal;
