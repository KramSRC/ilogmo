/**
 * iLogMo - Settings Screen
 * App-level preferences, appearance theme, account settings, data export, legal info, and sign-out.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import {
  ArrowLeft,
  Bell,
  User,
  KeyRound,
  Mail,
  Lock,
  Download,
  Trash2,
  Info,
  ShieldCheck,
  FileText,
  LogOut,
  Sliders,
} from 'lucide-react-native';
import {
  useSettings,
  SettingsSection,
  SettingsRow,
  AppearanceSection,
  ExportDataModal,
  DeleteAccountModal,
  AboutModal,
  LegalModal,
  LegalDocType,
} from '@/features/settings';
import { ChangePasswordModal, profileService } from '@/features/profile';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    user,
    profile,
    themeMode,
    setThemeMode,
    exportData,
    isExporting,
    deleteAccount,
    isDeleting,
    logout,
  } = useSettings();

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const userEmail = profile?.email || user?.email || 'student@example.com';

  /**
   * Sign out confirmation handler.
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

  /**
   * Delete account confirmation wrapper.
   */
  const handleConfirmDelete = async (): Promise<{ success: boolean; error?: string }> => {
    const result = await deleteAccount();
    if (result.success) {
      setIsDeleteModalOpen(false);
      Alert.alert(
        'Account Deleted',
        'Your iLogMo data has been wiped and you have been signed out.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
      return { success: true };
    }
    return result;
  };

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      {/* 1. Header Bar */}
      <View className="px-5 pt-3 pb-3 flex-row items-center border-b border-neutral-100 bg-white">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(app)');
            }
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{ minHeight: 44, minWidth: 44 }}
          className="rounded-full bg-white items-center justify-center border border-neutral-200 mr-3 shadow-soft-sm"
        >
          <ArrowLeft size={20} color={colors.neutral[700]} />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-xl font-bold font-sans text-neutral-900">Settings</Text>
          <Text className="text-xs font-sans text-neutral-500">
            Customize your iLogMo experience
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
        className="px-5 pt-4"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: APPEARANCE */}
        {/* ========================================================================= */}
        <SettingsSection title="Appearance">
          <AppearanceSection themeMode={themeMode} onSelectTheme={setThemeMode} />
        </SettingsSection>

        {/* ========================================================================= */}
        {/* SECTION 2: NOTIFICATIONS */}
        {/* ========================================================================= */}
        <SettingsSection title="Notifications">
          <SettingsRow
            icon={<Bell size={18} color="#0284C7" />}
            iconBgColor="bg-sky-50"
            iconBorderColor="border-sky-100"
            title="Notification Settings"
            subtitle="Manage your OJT reminders and daily alerts"
            onPress={() => router.push('/(app)/notifications')}
            isLast={true}
          />
        </SettingsSection>

        {/* ========================================================================= */}
        {/* SECTION 3: ACCOUNT */}
        {/* ========================================================================= */}
        <SettingsSection title="Account">
          <SettingsRow
            icon={<User size={18} color={colors.primary[600]} />}
            iconBgColor="bg-primary-50"
            iconBorderColor="border-primary-100"
            title="Profile"
            subtitle="Manage your personal details and photo"
            onPress={() => router.push('/(app)/profile')}
          />

          <SettingsRow
            icon={<KeyRound size={18} color="#4F46E5" />}
            iconBgColor="bg-indigo-50"
            iconBorderColor="border-indigo-100"
            title="Change Password"
            subtitle="Update your account security password"
            onPress={() => setIsPasswordModalOpen(true)}
          />

          <SettingsRow
            icon={<Mail size={18} color={colors.neutral[600]} />}
            iconBgColor="bg-neutral-50"
            iconBorderColor="border-neutral-200"
            title="Email"
            value={userEmail}
            rightElement={
              <View className="ml-1">
                <Lock size={13} color={colors.neutral[400]} />
              </View>
            }
            showChevron={false}
            isLast={true}
          />
        </SettingsSection>

        {/* ========================================================================= */}
        {/* SECTION 4: DATA & PRIVACY */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* SECTION 4: DATA & PRIVACY */}
        {/* ========================================================================= */}
        <SettingsSection title="Data & Privacy">
          <SettingsRow
            icon={<FileText size={18} color="#8B5CF6" />}
            iconBgColor="bg-purple-50"
            iconBorderColor="border-purple-100"
            title="OJT Progress Reports"
            subtitle="View formal summaries and export PDF/JSON reports"
            onPress={() => router.push('/(app)/reports')}
          />

          <SettingsRow
            icon={<Download size={18} color={colors.primary[600]} />}
            iconBgColor="bg-primary-50"
            iconBorderColor="border-primary-100"
            title="Export My Data"
            subtitle="Create a copy of your raw records as JSON"
            onPress={() => setIsExportModalOpen(true)}
          />

          <SettingsRow
            icon={<Trash2 size={18} color="#DC2626" />}
            iconBgColor="bg-red-50"
            iconBorderColor="border-red-100"
            title="Delete Account"
            subtitle="Permanently remove your account and records"
            isDestructive={true}
            onPress={() => setIsDeleteModalOpen(true)}
            isLast={true}
          />
        </SettingsSection>

        {/* ========================================================================= */}
        {/* SECTION 5: ABOUT */}
        {/* ========================================================================= */}
        <SettingsSection title="About">
          <SettingsRow
            icon={<Info size={18} color="#0284C7" />}
            iconBgColor="bg-sky-50"
            iconBorderColor="border-sky-100"
            title="About iLogMo"
            subtitle="OJT Hours & Experience Tracker"
            value={`v${appVersion}`}
            onPress={() => setIsAboutModalOpen(true)}
          />

          <SettingsRow
            icon={<ShieldCheck size={18} color="#059669" />}
            iconBgColor="bg-emerald-50"
            iconBorderColor="border-emerald-100"
            title="Privacy Policy"
            subtitle="How iLogMo handles and protects your data"
            onPress={() => setLegalModalType('privacy')}
          />

          <SettingsRow
            icon={<FileText size={18} color="#D97706" />}
            iconBgColor="bg-amber-50"
            iconBorderColor="border-amber-100"
            title="Terms of Service"
            subtitle="Rules and acceptable usage guidelines"
            onPress={() => setLegalModalType('terms')}
            isLast={true}
          />
        </SettingsSection>

        {/* ========================================================================= */}
        {/* SECTION 6: DANGER ZONE */}
        {/* ========================================================================= */}
        <SettingsSection title="Danger Zone">
          <SettingsRow
            icon={<LogOut size={18} color="#DC2626" />}
            iconBgColor="bg-red-50"
            iconBorderColor="border-red-100"
            title="Sign Out"
            subtitle="Log out of your session on this device"
            isDestructive={true}
            showChevron={false}
            onPress={handleSignOut}
            isLast={true}
          />
        </SettingsSection>
      </ScrollView>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Change Password Modal */}
      <ChangePasswordModal
        visible={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={profileService.changePassword}
      />

      {/* 2. Export Data Modal */}
      <ExportDataModal
        visible={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={exportData}
        isExporting={isExporting}
      />

      {/* 3. Delete Account Modal */}
      <DeleteAccountModal
        visible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* 4. About Modal */}
      <AboutModal visible={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />

      {/* 5. Legal (Privacy / Terms) Modal */}
      {legalModalType ? (
        <LegalModal
          visible={!!legalModalType}
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}
