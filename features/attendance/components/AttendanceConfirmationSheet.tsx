import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { PlayCircle, LogOut, X } from 'lucide-react-native';
import { Button } from '@/components';
import { formatTimeDisplay } from '../utils/timeUtils';
import { colors } from '@/constants/colors';

export interface AttendanceConfirmationSheetProps {
  visible: boolean;
  type: 'check_in' | 'check_out' | null;
  checkInTime?: string;
  currentDuration?: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AttendanceConfirmationSheet({
  visible,
  type,
  checkInTime,
  currentDuration,
  isSubmitting = false,
  onConfirm,
  onCancel,
}: AttendanceConfirmationSheetProps) {
  if (!visible || !type) return null;

  const nowFormatted = formatTimeDisplay(new Date());
  const isCheckIn = type === 'check_in';

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-card p-6 shadow-card border border-neutral-200 w-full max-w-sm">
          {/* Header with Close Icon */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View
                className={`w-10 h-10 rounded-2xl items-center justify-center mr-3 border ${
                  isCheckIn ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'
                }`}
              >
                {isCheckIn ? (
                  <PlayCircle size={22} color={colors.success.DEFAULT} />
                ) : (
                  <LogOut size={22} color={colors.primary[600]} />
                )}
              </View>
              <Text className="text-lg font-bold font-sans text-neutral-900">
                {isCheckIn ? 'Start your OJT day?' : 'Finish your OJT day?'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onCancel}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center"
            >
              <X size={16} color={colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          {/* Description Content */}
          <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 mb-6">
            {isCheckIn ? (
              <View className="items-center py-2">
                <Text className="text-xs font-sans text-neutral-500 mb-1">Current Time</Text>
                <Text className="text-2xl font-bold font-sans text-neutral-900">
                  {nowFormatted}
                </Text>
                <Text className="text-xs font-sans text-neutral-500 mt-2 text-center">
                  Your check-in timestamp will be recorded for today's log.
                </Text>
              </View>
            ) : (
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs font-sans text-neutral-500">Checked in at</Text>
                  <Text className="text-xs font-bold font-sans text-neutral-800">
                    {formatTimeDisplay(checkInTime)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center mt-1">
                  <Text className="text-xs font-sans text-neutral-500">Checking out at</Text>
                  <Text className="text-xs font-bold font-sans text-neutral-800">
                    {nowFormatted}
                  </Text>
                </View>
                <View className="pt-2 mt-2 border-t border-neutral-200 flex-row justify-between items-center">
                  <Text className="text-xs font-bold font-sans text-neutral-700">
                    Today's Total
                  </Text>
                  <Text className="text-sm font-bold font-sans text-primary-600">
                    {currentDuration || '0h 00m'}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <Button
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              size="md"
              disabled={isSubmitting}
              className="flex-1 mr-2"
            />
            <Button
              title={isCheckIn ? 'Confirm Check In' : 'Confirm Check Out'}
              onPress={onConfirm}
              isLoading={isSubmitting}
              loadingText={isCheckIn ? 'Checking In...' : 'Checking Out...'}
              variant="primary"
              size="md"
              className="flex-1 ml-2"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default AttendanceConfirmationSheet;
