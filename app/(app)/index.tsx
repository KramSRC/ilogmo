import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, User, ShieldCheck, Mail, IdCard, Sparkles } from 'lucide-react-native';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button, Logo } from '@/components';
import { colors } from '@/constants/colors';

export default function HomePlaceholderScreen() {
  const router = useRouter();
  const { user, profile, logout, isSubmitting } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`.trim()
      : 'Student Trainee';

  const studentId = profile?.student_id || user?.user_metadata?.student_id || 'Not specified';
  const email = profile?.email || user?.email || 'N/A';

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
        className="px-6 py-6"
      >
        {/* Brand Header */}
        <View className="items-center mb-8">
          <Logo size="md" subtitle="OJT made simple." />
        </View>

        {/* Home Placeholder Card */}
        <View className="bg-white rounded-card p-6 shadow-card border border-neutral-200 mb-6">
          {/* Status Badge */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-neutral-100">
            <View className="flex-row items-center bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck size={14} color={colors.success.DEFAULT} />
              <Text className="ml-1.5 text-xs font-semibold font-sans text-emerald-700">
                Authenticated
              </Text>
            </View>
            <Text className="text-xs font-sans text-neutral-400">Step 2 Completed</Text>
          </View>

          {/* User Profile Summary */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center mr-3 border border-primary-100">
                <User size={22} color={colors.primary[600]} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold font-sans text-neutral-900">{displayName}</Text>
                <Text className="text-xs font-sans text-neutral-500">OJT Trainee</Text>
              </View>
            </View>

            {/* Profile Info Details */}
            <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2.5">
              <View className="flex-row items-center">
                <Mail size={15} color={colors.neutral[500]} />
                <Text className="ml-2 text-xs font-sans text-neutral-600 font-medium flex-1">
                  {email}
                </Text>
              </View>

              <View className="flex-row items-center mt-2">
                <IdCard size={15} color={colors.neutral[500]} />
                <Text className="ml-2 text-xs font-sans text-neutral-600 font-medium flex-1">
                  Student ID: {studentId}
                </Text>
              </View>
            </View>
          </View>

          {/* Feature Coming Soon Notice */}
          <View className="bg-primary-50 rounded-2xl p-4 border border-primary-100 mb-6">
            <View className="flex-row items-center mb-1.5">
              <Sparkles size={16} color={colors.primary[600]} />
              <Text className="ml-2 text-sm font-bold font-sans text-primary-900">
                Home is coming soon
              </Text>
            </View>
            <Text className="text-xs font-sans text-primary-800 leading-4">
              Authentication and session management are fully configured. The full Dashboard,
              Attendance, Journal, and Analytics will be developed in future steps.
            </Text>
          </View>

          {/* Temporary Sign Out Button */}
          <Button
            title="Sign Out"
            onPress={handleLogout}
            isLoading={isSubmitting}
            loadingText="Signing out..."
            variant="outline"
            leftIcon={<LogOut size={18} color={colors.neutral[700]} />}
            className="w-full"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
