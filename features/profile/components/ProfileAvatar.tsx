/**
 * iLogMo - ProfileAvatar Component
 * Displays a student profile picture with image fallback to initials and camera edit trigger.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera } from 'lucide-react-native';
import { getInitials } from '../utils/profileUtils';
import { colors } from '@/constants/colors';

export interface ProfileAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  size?: number;
  isUploading?: boolean;
  onEditPress?: () => void;
  showEditBadge?: boolean;
}

export function ProfileAvatar({
  firstName,
  lastName,
  avatarUrl,
  size = 96,
  isUploading = false,
  onEditPress,
  showEditBadge = true,
}: ProfileAvatarProps) {
  const initials = getInitials(firstName, lastName);
  const badgeSize = Math.max(28, Math.round(size * 0.32));
  const fontSize = Math.round(size * 0.38);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View className="relative items-center justify-center">
      {/* Avatar Circle */}
      <View
        style={containerStyle}
        className="bg-primary-100 border-2 border-primary-200 items-center justify-center overflow-hidden shadow-soft-sm"
      >
        {isUploading ? (
          <ActivityIndicator size="small" color={colors.primary[600]} />
        ) : avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: size, height: size }}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={{ fontSize }}
            className="font-bold font-sans text-primary-700 tracking-wider"
          >
            {initials}
          </Text>
        )}
      </View>

      {/* Edit Camera Badge */}
      {showEditBadge && onEditPress ? (
        <TouchableOpacity
          onPress={onEditPress}
          activeOpacity={0.8}
          disabled={isUploading}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          style={{
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            bottom: -2,
            right: -2,
          }}
          className="absolute bg-primary-600 border-2 border-white items-center justify-center shadow-soft-sm"
        >
          <Camera size={Math.round(badgeSize * 0.52)} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default ProfileAvatar;
