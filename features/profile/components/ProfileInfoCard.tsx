/**
 * iLogMo - ProfileInfoCard Component
 * Displays student Personal Information with an action to edit.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, Phone, Mail, AtSign, Edit3 } from 'lucide-react-native';
import { Profile } from '../types';
import { formatFullName } from '../utils/profileUtils';
import { colors } from '@/constants/colors';

export interface ProfileInfoCardProps {
  profile: Profile | null;
  onEditPress: () => void;
}

export function ProfileInfoCard({ profile, onEditPress }: ProfileInfoCardProps) {
  const fullName = formatFullName(profile?.firstName, profile?.lastName);
  const contactNumber = profile?.contactNumber || 'Not provided';
  const email = profile?.email || 'N/A';
  const username = profile?.username ? `@${profile.username}` : 'Not set';

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-card p-5 mb-4 shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">Personal Information</Text>
        <TouchableOpacity
          onPress={onEditPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          className="flex-row items-center bg-primary-50 dark:bg-primary-900/40 px-2.5 py-1.5 rounded-lg border border-primary-100 dark:border-primary-800/50"
        >
          <Edit3 size={13} color={colors.primary[600]} />
          <Text className="text-xs font-semibold font-sans text-primary-700 dark:text-primary-300 ml-1">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Fields */}
      <View className="space-y-3">
        {/* Full Name */}
        <View className="flex-row items-center py-1 border-b border-neutral-100 dark:border-neutral-800">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 items-center justify-center mr-3 border border-neutral-100 dark:border-neutral-800">
            <User size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Full Name</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800 dark:text-neutral-200">{fullName}</Text>
          </View>
        </View>

        {/* Contact Number */}
        <View className="flex-row items-center py-1 border-b border-neutral-100 dark:border-neutral-800">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 items-center justify-center mr-3 border border-neutral-100 dark:border-neutral-800">
            <Phone size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Contact Number</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800 dark:text-neutral-200">{contactNumber}</Text>
          </View>
        </View>

        {/* Email */}
        <View className="flex-row items-center py-1 border-b border-neutral-100 dark:border-neutral-800">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 items-center justify-center mr-3 border border-neutral-100 dark:border-neutral-800">
            <Mail size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Email Address</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800 dark:text-neutral-200">{email}</Text>
          </View>
        </View>

        {/* Username */}
        <View className="flex-row items-center pt-1">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 items-center justify-center mr-3 border border-neutral-100 dark:border-neutral-800">
            <AtSign size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Username</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800 dark:text-neutral-200">{username}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ProfileInfoCard;
