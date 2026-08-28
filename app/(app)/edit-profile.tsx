/**
 * iLogMo - Edit Profile Screen
 * Allows students to update their name, contact number, username, and profile photo.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Lock } from 'lucide-react-native';
import {
  useProfile,
  ProfileAvatar,
  validateContactNumber,
  validateUsername,
} from '@/features/profile';
import { Input, Button, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, uploadAvatar, isSaving, isUploadingAvatar } = useProfile();

  const [firstName, setFirstName] = useState<string>(profile?.firstName || '');
  const [lastName, setLastName] = useState<string>(profile?.lastName || '');
  const [contactNumber, setContactNumber] = useState<string>(profile?.contactNumber || '');
  const [username, setUsername] = useState<string>(profile?.username || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * Handle photo change via image picker.
   */
  const handleChangePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const mimeType = asset.mimeType || 'image/jpeg';

      const uploadResult = await uploadAvatar(asset.uri, mimeType);
      if (uploadResult.success) {
        Alert.alert('Success', 'Profile photo updated.');
      } else {
        Alert.alert('Error', uploadResult.error || 'Unable to update profile photo.');
      }
    } catch (err: any) {
      console.warn('[EditProfileScreen.handleChangePhoto] Error:', err);
      Alert.alert('Error', 'Failed to pick image from photo library.');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (contactNumber.trim() && !validateContactNumber(contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid phone number (7-15 digits).';
    }

    if (username.trim()) {
      const userCheck = validateUsername(username.trim());
      if (!userCheck.valid) {
        newErrors.username = userCheck.error || 'Invalid username.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isSaving) return;
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    const result = await updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      contactNumber: contactNumber.trim() || undefined,
      username: username.trim().toLowerCase() || undefined,
    });

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully.', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } else {
      setFormError(result.error || 'Unable to save your changes.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-app dark:bg-neutral-950" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)/profile');
              }
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{ minHeight: 44, minWidth: 44 }}
            className="rounded-full bg-white dark:bg-neutral-900 items-center justify-center border border-neutral-200 dark:border-neutral-800 mr-3 shadow-soft-sm"
          >
            <ArrowLeft size={20} color={colors.neutral[700]} />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">Edit Profile</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          className="px-5 pt-4"
        >
          {/* Top Form Error */}
          {formError ? (
            <View className="mb-4">
              <ErrorMessage message={formError} type="error" />
            </View>
          ) : null}

          {/* 1. Avatar Section */}
          <View className="items-center mb-6">
            <ProfileAvatar
              firstName={firstName || profile?.firstName}
              lastName={lastName || profile?.lastName}
              avatarUrl={profile?.avatarUrl}
              size={96}
              isUploading={isUploadingAvatar}
              onEditPress={handleChangePhoto}
              showEditBadge={true}
            />

            <TouchableOpacity
              onPress={handleChangePhoto}
              activeOpacity={0.7}
              disabled={isUploadingAvatar}
              className="mt-2.5 bg-neutral-100 dark:bg-neutral-800 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800"
            >
              <Text className="text-xs font-semibold font-sans text-primary-600">
                {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Form Fields */}
          <View className="space-y-4 mb-6">
            <Input
              label="First Name *"
              placeholder="e.g. Juan"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                setErrors((prev) => ({ ...prev, firstName: '' }));
              }}
              error={errors.firstName}
              editable={!isSaving}
              autoCapitalize="words"
            />

            <Input
              label="Last Name *"
              placeholder="e.g. Dela Cruz"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                setErrors((prev) => ({ ...prev, lastName: '' }));
              }}
              error={errors.lastName}
              editable={!isSaving}
              autoCapitalize="words"
            />

            <Input
              label="Contact Number"
              placeholder="e.g. +639171234567"
              value={contactNumber}
              onChangeText={(text) => {
                setContactNumber(text);
                setErrors((prev) => ({ ...prev, contactNumber: '' }));
              }}
              error={errors.contactNumber}
              editable={!isSaving}
              keyboardType="phone-pad"
            />

            <Input
              label="Username"
              placeholder="e.g. juandc"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors((prev) => ({ ...prev, username: '' }));
              }}
              error={errors.username}
              editable={!isSaving}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Read-Only Email Field */}
            <View>
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200">
                  Email Address
                </Text>
                <View className="flex-row items-center">
                  <Lock size={12} color={colors.neutral[400]} />
                  <Text className="text-[11px] font-sans text-neutral-400 ml-1">Read-only</Text>
                </View>
              </View>
              <View className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-3.5 py-3 border border-neutral-200 dark:border-neutral-800">
                <Text className="text-base font-sans text-neutral-500 dark:text-neutral-400">
                  {profile?.email || 'N/A'}
                </Text>
              </View>
              <Text className="text-[11px] font-sans text-neutral-400 mt-1">
                Your email is managed by your account authentication.
              </Text>
            </View>
          </View>

          {/* 3. Save Button */}
          <Button
            title="Save Changes"
            isLoading={isSaving}
            loadingText="Saving..."
            onPress={handleSave}
            variant="primary"
            size="lg"
            className="w-full shadow-button"
            disabled={isSaving}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
