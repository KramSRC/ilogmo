/**
 * iLogMo - Student Profile Screen
 * Displays personal details, avatar management, OJT configuration summary, account actions, and sign-out.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  useProfile,
  ProfileAvatar,
  ProfileInfoCard,
  ProfileOjtCard,
  ProfileAccountCard,
  ChangePasswordModal,
  ProfileSkeleton,
  formatFullName,
} from '@/features/profile';
import { ErrorMessage, Button } from '@/components';
import { colors } from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    profile,
    ojtRecord,
    isLoading,
    isUploadingAvatar,
    error,
    refresh,
    uploadAvatar,
    changePassword,
    logout,
  } = useProfile();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  /**
   * Launch image picker to update profile photo.
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
      console.warn('[ProfileScreen.handleChangePhoto] Error:', err);
      Alert.alert('Error', 'Failed to pick image from photo library.');
    }
  };

  /**
   * Handle Sign Out with confirmation dialog.
   */
  const handleSignOut = () => {
    Alert.alert('Sign out of iLogMo?', 'You will need to sign in again to access your account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const fullName = formatFullName(profile?.firstName, profile?.lastName);
  const userSubtitle = profile?.username
    ? `@${profile.username} · ${profile.email}`
    : profile?.email || '';

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary[600]}
            colors={[colors.primary[600]]}
          />
        }
        className="px-5 pt-3"
      >
        {/* 1. Header */}
        <View className="mb-4">
          <Text className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
            Profile
          </Text>
          <Text className="text-xs font-sans text-neutral-500 mt-0.5">
            Manage your personal information
          </Text>
        </View>

        {/* Error State Banner */}
        {error ? (
          <View className="mb-4">
            <ErrorMessage message={error} type="error" />
            <Button
              title="Try Again"
              onPress={refresh}
              variant="outline"
              size="sm"
              className="mt-2"
            />
          </View>
        ) : null}

        {isLoading && !isRefreshing ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* 2. Top Profile Avatar & Name Card */}
            <View className="bg-white rounded-card p-6 shadow-card border border-neutral-200 mb-4 items-center">
              <ProfileAvatar
                firstName={profile?.firstName}
                lastName={profile?.lastName}
                avatarUrl={profile?.avatarUrl}
                size={90}
                isUploading={isUploadingAvatar}
                onEditPress={handleChangePhoto}
                showEditBadge={true}
              />

              <Text
                className="text-xl font-bold font-sans text-neutral-900 mt-3.5 text-center"
                numberOfLines={1}
              >
                {fullName}
              </Text>

              <Text
                className="text-xs font-sans text-neutral-500 mt-0.5 text-center"
                numberOfLines={1}
              >
                {userSubtitle}
              </Text>
            </View>

            {/* 3. Personal Information Card */}
            <ProfileInfoCard
              profile={profile}
              onEditPress={() => router.push('/(app)/edit-profile')}
            />

            {/* 4. OJT Information Card (Read-Only) */}
            <ProfileOjtCard
              ojtRecord={ojtRecord}
              onViewDetails={() => router.push('/(app)/edit-ojt')}
            />

            {/* 5. Account & Danger Zone Actions */}
            <ProfileAccountCard
              profile={profile}
              onChangePasswordPress={() => setIsPasswordModalOpen(true)}
              onNotificationSettingsPress={() => router.push('/(app)/notifications')}
              onSignOutPress={handleSignOut}
            />
          </>
        )}
      </ScrollView>

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={changePassword}
      />
    </SafeAreaView>
  );
}
