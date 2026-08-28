/**
 * iLogMo - LegalModal Component
 * Reusable modal for displaying Privacy Policy and Terms of Service documents.
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, ShieldCheck, FileText } from 'lucide-react-native';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

export type LegalDocType = 'privacy' | 'terms';

export interface LegalModalProps {
  visible: boolean;
  type: LegalDocType;
  onClose: () => void;
}

export function LegalModal({ visible, type, onClose }: LegalModalProps) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const subtitle = isPrivacy
    ? 'How iLogMo handles your data'
    : 'Rules and guidelines for using iLogMo';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-6 border-t border-neutral-200 dark:border-transparent max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3.5 border-b border-neutral-100 dark:border-neutral-800 mb-4">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/40 items-center justify-center mr-3 border border-primary-100 dark:border-primary-800/50">
                {isPrivacy ? (
                  <ShieldCheck size={20} color={colors.primary[600]} />
                ) : (
                  <FileText size={20} color={colors.primary[600]} />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100">{title}</Text>
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">{subtitle}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={`Close ${title}`}
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
            >
              <X size={18} color={colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
            <View className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-transparent mb-3">
              <Text className="text-sm font-semibold font-sans text-neutral-800 dark:text-neutral-200 mb-2">
                Document Notice
              </Text>
              <Text className="text-xs font-sans text-neutral-600 dark:text-neutral-400 leading-5 mb-3">
                {isPrivacy
                  ? 'This privacy policy is currently being prepared by the iLogMo administration. Your personal data, attendance logs, and journals are stored securely using industry-standard Row-Level Security.'
                  : 'These terms of service are currently being prepared. By using the iLogMo platform during your on-the-job training, you agree to log accurate internship hours and maintain professional reflection journals.'}
              </Text>

              <View className="bg-primary-50 dark:bg-primary-900/40/70 p-3 rounded-xl border border-primary-200">
                <Text className="text-[11px] font-medium font-sans text-primary-800 leading-4">
                  For any immediate privacy or compliance inquiries, please contact your university
                  OJT coordinator or internship supervisor.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Close Button */}
          <Button
            title="Close"
            onPress={onClose}
            variant="primary"
            size="lg"
            className="w-full shadow-button dark:shadow-none"
          />
        </View>
      </View>
    </Modal>
  );
}

export default LegalModal;
