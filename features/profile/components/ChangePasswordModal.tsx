/**
 * iLogMo - ChangePasswordModal Component
 * Modal allowing students to update their password securely via Supabase Auth.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { X, KeyRound } from 'lucide-react-native';
import { PasswordInput, Button, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export function ChangePasswordModal({ visible, onClose, onSubmit }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    setError(null);

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(newPassword);
      if (result.success) {
        Alert.alert('Success', 'Password updated successfully.', [
          {
            text: 'OK',
            onPress: handleClose,
          },
        ]);
      } else {
        setError(result.error || 'Unable to update password.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black/50 justify-end"
      >
        <View className="bg-white rounded-t-3xl p-6 border-t border-neutral-200">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-neutral-100 mb-4">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center mr-3 border border-indigo-100">
                <KeyRound size={20} color="#4F46E5" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold font-sans text-neutral-900">
                  Change Password
                </Text>
                <Text className="text-xs font-sans text-neutral-500">
                  Enter your new account password
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
              className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center"
            >
              <X size={18} color={colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {error ? (
            <View className="mb-4">
              <ErrorMessage message={error} type="error" />
            </View>
          ) : null}

          {/* Form */}
          <View className="space-y-4 mb-6">
            <PasswordInput
              label="New Password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setError(null);
              }}
              editable={!isSubmitting}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setError(null);
              }}
              editable={!isSubmitting}
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <Button
              title="Cancel"
              onPress={handleClose}
              variant="outline"
              size="lg"
              className="flex-1 mr-2"
              disabled={isSubmitting}
            />
            <Button
              title="Update Password"
              isLoading={isSubmitting}
              loadingText="Updating..."
              onPress={handleSave}
              variant="primary"
              size="lg"
              className="flex-1 ml-2 shadow-button"
              disabled={isSubmitting}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default ChangePasswordModal;
