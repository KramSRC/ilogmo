/**
 * iLogMo - Notification Center Screen
 * Displays grouped notifications (Today / Earlier), unread tracking, mark all as read, and settings.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCheck, SlidersHorizontal } from 'lucide-react-native';
import {
  useNotifications,
  Notification,
  getNotificationTypeDetails,
} from '@/features/notifications';
import {
  NotificationCard,
  NotificationEmptyState,
  NotificationSkeleton,
  NotificationSettingsModal,
} from '@/features/notifications/components';
import { ErrorMessage, Button } from '@/components';
import { colors } from '@/constants/colors';

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    todayNotifications,
    earlierNotifications,
    unreadCount,
    settings,
    isLoading,
    isRefreshing,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
  } = useNotifications();

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    await markAllAsRead();
    setSuccessBanner('All notifications marked as read.');
    setTimeout(() => {
      setSuccessBanner(null);
    }, 3000);
  };

  const handleNotificationPress = async (item: Notification) => {
    // Mark as read
    if (!item.isRead) {
      await markAsRead(item.id);
    }

    // Determine target route
    const meta = getNotificationTypeDetails(item.type, item.relatedType);
    if (meta.defaultRoute) {
      router.push(meta.defaultRoute as any);
    }
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert('Delete Notification', 'Remove this notification from your history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteNotification(id),
      },
    ]);
  };

  const hasNotifications = todayNotifications.length > 0 || earlierNotifications.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      {/* 1. Header Bar */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 bg-white">
        <View className="flex-row items-center flex-1 mr-2">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="w-10 h-10 rounded-full bg-white items-center justify-center border border-neutral-200 mr-3"
          >
            <ArrowLeft size={20} color={colors.neutral[700]} />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-xl font-bold font-sans text-neutral-900">Notifications</Text>
            <Text className="text-xs font-sans text-neutral-500">Stay updated with your OJT</Text>
          </View>
        </View>

        {/* Right Actions: Settings + Mark All Read */}
        <View className="flex-row items-center space-x-2">
          {/* Settings Modal Trigger */}
          <TouchableOpacity
            onPress={() => setIsSettingsOpen(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Notification settings"
            className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 items-center justify-center mr-1"
          >
            <SlidersHorizontal size={18} color={colors.neutral[700]} />
          </TouchableOpacity>

          {/* Mark All As Read Button */}
          {unreadCount > 0 ? (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Mark all as read"
              className="flex-row items-center bg-primary-50 border border-primary-200 px-3 py-2 rounded-xl"
            >
              <CheckCheck size={15} color={colors.primary[600]} />
              <Text className="text-xs font-bold font-sans text-primary-700 ml-1">Mark all</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary[600]}
            colors={[colors.primary[600]]}
          />
        }
        className="px-5 pt-3"
      >
        {/* Success Banner */}
        {successBanner ? (
          <View className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex-row items-center">
            <Text className="text-xs font-semibold font-sans text-emerald-800">
              {successBanner}
            </Text>
          </View>
        ) : null}

        {/* Error Banner */}
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

        {/* Content */}
        {isLoading && !isRefreshing ? (
          <NotificationSkeleton />
        ) : !hasNotifications ? (
          <NotificationEmptyState />
        ) : (
          <>
            {/* Today Group */}
            {todayNotifications.length > 0 ? (
              <View className="mb-4">
                <Text className="text-xs font-bold font-sans text-neutral-400 uppercase tracking-wider mb-2.5 px-1">
                  Today
                </Text>
                {todayNotifications.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onPress={handleNotificationPress}
                    onDelete={handleDeleteNotification}
                  />
                ))}
              </View>
            ) : null}

            {/* Earlier Group */}
            {earlierNotifications.length > 0 ? (
              <View className="mb-4">
                <Text className="text-xs font-bold font-sans text-neutral-400 uppercase tracking-wider mb-2.5 px-1">
                  Earlier
                </Text>
                {earlierNotifications.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onPress={handleNotificationPress}
                    onDelete={handleDeleteNotification}
                  />
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      {/* Settings Modal */}
      <NotificationSettingsModal
        visible={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSetting={(key, val) => updateSettings({ [key]: val })}
      />
    </SafeAreaView>
  );
}
