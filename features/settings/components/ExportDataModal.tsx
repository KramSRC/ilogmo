/**
 * iLogMo - ExportDataModal Component
 * Modal to guide the student through exporting their account data as a structured JSON file.
 */

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { X, Download, ShieldCheck, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { Button, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export interface ExportDataModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: () => Promise<{ success: boolean; error?: string }>;
  isExporting: boolean;
}

export function ExportDataModal({
  visible,
  onClose,
  onExport,
  isExporting,
}: ExportDataModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleExport = async () => {
    setError(null);
    setSuccess(false);

    const result = await onExport();
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Unable to export your data.');
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-6 border-t border-neutral-200 dark:border-neutral-800 max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3.5 border-b border-neutral-100 dark:border-neutral-800 mb-4">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/40 items-center justify-center mr-3 border border-primary-100 dark:border-primary-800/50">
                <Download size={20} color={colors.primary[600]} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100">Export My Data</Text>
                <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">
                  Create a copy of your iLogMo data
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close export modal"
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center"
            >
              <X size={18} color={colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
            {/* Status Messages */}
            {error ? (
              <View className="mb-4">
                <ErrorMessage message={error} type="error" />
              </View>
            ) : null}

            {success ? (
              <View className="bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-4 flex-row items-center">
                <CheckCircle2 size={20} color={colors.success.DEFAULT} className="mr-3" />
                <View className="flex-1 ml-2.5">
                  <Text className="text-sm font-bold font-sans text-emerald-900 dark:text-emerald-100">
                    Your data export is ready.
                  </Text>
                  <Text className="text-xs font-sans text-emerald-700 dark:text-emerald-300 mt-0.5">
                    The share sheet has been opened to save or share your JSON export file.
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Explanation card */}
            <View className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 mb-4">
              <Text className="text-xs font-bold font-sans text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wide">
                What is included in your export:
              </Text>

              <View className="space-y-2">
                <View className="flex-row items-center">
                  <FileSpreadsheet size={15} color={colors.primary[600]} className="mr-2" />
                  <Text className="text-xs font-sans text-neutral-700 dark:text-neutral-300 ml-2">
                    • Profile & Student information
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FileSpreadsheet size={15} color={colors.primary[600]} className="mr-2" />
                  <Text className="text-xs font-sans text-neutral-700 dark:text-neutral-300 ml-2">
                    • OJT Program configuration & hours
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FileSpreadsheet size={15} color={colors.primary[600]} className="mr-2" />
                  <Text className="text-xs font-sans text-neutral-700 dark:text-neutral-300 ml-2">
                    • Attendance logs & time records
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FileSpreadsheet size={15} color={colors.primary[600]} className="mr-2" />
                  <Text className="text-xs font-sans text-neutral-700 dark:text-neutral-300 ml-2">
                    • Journal entries & learning reflections
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FileSpreadsheet size={15} color={colors.primary[600]} className="mr-2" />
                  <Text className="text-xs font-sans text-neutral-700 dark:text-neutral-300 ml-2">
                    • Tasks & completion history
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FileSpreadsheet size={15} color={colors.primary[600]} className="mr-2" />
                  <Text className="text-xs font-sans text-neutral-700 dark:text-neutral-300 ml-2">
                    • Documents metadata (file names, sizes, dates)
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FileSpreadsheet size={15} color={colors.primary[600]} className="mr-2" />
                  <Text className="text-xs font-sans text-neutral-700 dark:text-neutral-300 ml-2">
                    • Notifications & reminder settings
                  </Text>
                </View>
              </View>
            </View>

            {/* Privacy notice */}
            <View className="flex-row items-start p-3 bg-amber-50 dark:bg-amber-900/40 rounded-xl border border-amber-200 dark:border-amber-800 mb-2">
              <ShieldCheck size={16} color="#D97706" className="mt-0.5 mr-2" />
              <Text className="text-[11px] font-sans text-amber-800 dark:text-amber-300 flex-1 ml-2 leading-4">
                Passwords, authentication tokens, and private credentials are never exported. Document
                binaries are not downloaded to maintain a fast, lightweight export.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              title="Close"
              onPress={handleClose}
              variant="outline"
              size="lg"
              className="flex-1 mr-2"
              disabled={isExporting}
            />
            <Button
              title="Export Data"
              isLoading={isExporting}
              loadingText="Preparing export..."
              onPress={handleExport}
              variant="primary"
              size="lg"
              className="flex-1 ml-2 shadow-button dark:shadow-none"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ExportDataModal;
