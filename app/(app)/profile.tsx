import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, LogOut, Mail, IdCard } from 'lucide-react-native';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, logout, isSubmitting } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
      : 'Student Trainee';

  const email = profile?.email || user?.email || 'N/A';
  const studentId = profile?.student_id || user?.user_metadata?.student_id || 'Not specified';

  return (
    <SafeAreaView className="flex-1 bg-background-app items-center justify-center px-6">
      <View className="bg-white rounded-card p-6 shadow-card border border-neutral-200 w-full max-w-sm">
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-primary-50 rounded-3xl items-center justify-center mb-3 border border-primary-100">
            <User size={32} color={colors.primary[600]} />
          </View>
          <Text className="text-xl font-bold font-sans text-neutral-900 text-center">
            {displayName}
          </Text>
          <Text className="text-xs font-sans text-neutral-500 mt-0.5">OJT Trainee Profile</Text>
        </View>

        <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 mb-6 space-y-2.5">
          <View className="flex-row items-center">
            <Mail size={15} color={colors.neutral[500]} />
            <Text className="ml-2.5 text-xs font-sans text-neutral-700 font-medium flex-1">
              {email}
            </Text>
          </View>
          <View className="flex-row items-center mt-2">
            <IdCard size={15} color={colors.neutral[500]} />
            <Text className="ml-2.5 text-xs font-sans text-neutral-700 font-medium flex-1">
              Student ID: {studentId}
            </Text>
          </View>
        </View>

        <Button
          title="Sign Out"
          onPress={handleLogout}
          isLoading={isSubmitting}
          loadingText="Signing out..."
          variant="outline"
          leftIcon={<LogOut size={16} color={colors.neutral[700]} />}
          className="w-full"
        />
      </View>
    </SafeAreaView>
  );
}
