/**
 * iLogMo - DeleteAccountModal Component
 * Two-stage destructive warning modal requiring the user to type "DELETE" before initiating account data wipe.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, AlertTriangle, Trash2, ShieldAlert } from 'lucide-react-native';
import { Input, Button, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<{ success: boolean; error?: string }>;
  isDeleting: boolean;
}

export function DeleteAccountModal({
  visible,
  onClose,
  onConfirmDelete,
  isDeleting,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = confirmText.trim() === 'DELETE';

  const handleClose = () => {
    setConfirmText('');
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setError(null);

    const result = await onConfirmDelete();
    if (!result.success) {
      setError(result.error || 'Unable to delete your account.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black/60 justify-end"
      >
        <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-6 border-t border-red-200 dark:border-red-800 max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3.5 border-b border-neutral-100 dark:border-neutral-800 mb-4">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/40 items-center justify-center mr-3 border border-red-100">
                <AlertTriangle size={22} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold font-sans text-red-600">Delete Account?</Text>
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">
                  This action is permanent and irreversible
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close delete account modal"
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
            >
              <X size={18} color={colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
            {error ? (
              <View className="mb-4">
                <ErrorMessage message={error} type="error" />
              </View>
            ) : null}

            {/* Warning Details Card */}
            <View className="bg-red-50 dark:bg-red-900/40/60 rounded-2xl p-4 border border-red-200 dark:border-red-800 mb-4">
              <Text className="text-sm font-bold font-sans text-red-900 dark:text-red-100 mb-1">
                Deleting your account is permanent.
              </Text>
              <Text className="text-xs font-sans text-red-700 dark:text-red-300 leading-4 mb-3">
                All of your iLogMo internship data will be permanently wiped:
              </Text>

              <View className="space-y-1.5 pl-1">
                <Text className="text-xs font-sans text-red-800">• Attendance logs & hours records</Text>
                <Text className="text-xs font-sans text-red-800">• Daily journal reflections</Text>
                <Text className="text-xs font-sans text-red-800">• OJT tasks & priority tracking</Text>
                <Text className="text-xs font-sans text-red-800">• Uploaded document records</Text>
                <Text className="text-xs font-sans text-red-800">• OJT setup configuration</Text>
                <Text className="text-xs font-sans text-red-800">• Profile & account credentials</Text>
              </View>
            </View>

            {/* Type confirmation instruction */}
            <View className="mb-4">
              <Text className="text-xs font-bold font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">
                Type <Text className="font-bold text-red-600">DELETE</Text> to confirm:
              </Text>

              <Input
                placeholder="Type DELETE"
                value={confirmText}
                onChangeText={(text) => {
                  setConfirmText(text);
                  setError(null);
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!isDeleting}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              title="Cancel"
              onPress={handleClose}
              variant="outline"
              size="lg"
              className="flex-1 mr-2"
              disabled={isDeleting}
            />
            <Button
              title="Delete Account"
              isLoading={isDeleting}
              loadingText="Deleting account..."
              onPress={handleDelete}
              variant="danger"
              size="lg"
              className="flex-1 ml-2 shadow-button"
              disabled={!isConfirmed || isDeleting}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default DeleteAccountModal;
