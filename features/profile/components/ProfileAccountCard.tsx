/**
 * iLogMo - ProfileAccountCard Component
 * Displays student account settings, change password, notification settings, and sign-out actions.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { KeyRound, Bell, LogOut, ShieldCheck } from 'lucide-react-native';
import { Profile } from '../types';
import { formatAccountDate } from '../utils/profileUtils';
import { colors } from '@/constants/colors';

export interface ProfileAccountCardProps {
  profile: Profile | null;
  onChangePasswordPress: () => void;
  onNotificationSettingsPress: () => void;
  onSignOutPress: () => void;
}

export function ProfileAccountCard({
  profile,
  onChangePasswordPress,
  onNotificationSettingsPress,
  onSignOutPress,
}: ProfileAccountCardProps) {
  const memberSince = formatAccountDate(profile?.createdAt);

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 mb-6 shadow-card border border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Account</Text>
        <View className="flex-row items-center">
          <ShieldCheck size={14} color={colors.success.DEFAULT} />
          <Text className="text-[11px] font-semibold font-sans text-emerald-600 ml-1">
            Verified
          </Text>
        </View>
      </View>

      {/* Account Info Summary */}
      <View className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-3 border border-neutral-100 dark:border-neutral-800 mb-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-xs font-sans text-neutral-400">Account Status</Text>
          <Text className="text-xs font-semibold font-sans text-neutral-800 dark:text-neutral-200">Active Trainee</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-sans text-neutral-400">Member Since</Text>
          <Text className="text-xs font-semibold font-sans text-neutral-800 dark:text-neutral-200">{memberSince}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="space-y-2.5">
        {/* Change Password */}
        <TouchableOpacity
          onPress={onChangePasswordPress}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Change password"
          className="flex-row items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 items-center justify-center mr-3 border border-indigo-100 dark:border-indigo-800/50">
              <KeyRound size={15} color="#4F46E5" />
            </View>
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200">
              Change Password
            </Text>
          </View>
        </TouchableOpacity>

        {/* Notification Settings */}
        <TouchableOpacity
          onPress={onNotificationSettingsPress}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Notification settings"
          className="flex-row items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mt-2"
        >
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/40 items-center justify-center mr-3 border border-sky-100 dark:border-sky-800/50">
              <Bell size={15} color="#0284C7" />
            </View>
            <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200">
              Notification Settings
            </Text>
          </View>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={onSignOutPress}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Sign out of iLogMo"
          className="flex-row items-center justify-center p-3.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/40 mt-4"
        >
          <LogOut size={16} color="#DC2626" />
          <Text className="text-sm font-bold font-sans text-red-600 ml-2">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileAccountCard;
