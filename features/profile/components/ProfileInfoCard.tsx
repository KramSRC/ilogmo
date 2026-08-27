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
    <View className="bg-white rounded-card p-5 mb-4 shadow-card border border-neutral-200">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <Text className="text-base font-bold font-sans text-neutral-900">Personal Information</Text>
        <TouchableOpacity
          onPress={onEditPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          className="flex-row items-center bg-primary-50 px-2.5 py-1.5 rounded-lg border border-primary-100"
        >
          <Edit3 size={13} color={colors.primary[600]} />
          <Text className="text-xs font-semibold font-sans text-primary-700 ml-1">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Fields */}
      <View className="space-y-3">
        {/* Full Name */}
        <View className="flex-row items-center py-1 border-b border-neutral-100">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <User size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Full Name</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">{fullName}</Text>
          </View>
        </View>

        {/* Contact Number */}
        <View className="flex-row items-center py-1 border-b border-neutral-100">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <Phone size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Contact Number</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">{contactNumber}</Text>
          </View>
        </View>

        {/* Email */}
        <View className="flex-row items-center py-1 border-b border-neutral-100">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <Mail size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Email Address</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">{email}</Text>
          </View>
        </View>

        {/* Username */}
        <View className="flex-row items-center pt-1">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <AtSign size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Username</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">{username}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ProfileInfoCard;
