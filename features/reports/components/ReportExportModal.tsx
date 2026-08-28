/**
 * iLogMo - ReportExportModal Component
 * Modal allowing trainees to export their formal report as a print-friendly PDF or JSON file.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { FileText, FileCode, X, Download, CheckCircle2 } from 'lucide-react-native';
import { ExportFormat } from '../types';
import { colors } from '@/constants/colors';

export interface ReportExportModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => Promise<{ success: boolean; error?: string }>;
  isExporting: boolean;
}

export function ReportExportModal({
  visible,
  onClose,
  onExport,
  isExporting,
}: ReportExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleExportPress = async () => {
    setSuccessMessage(null);
    const result = await onExport(selectedFormat);
    if (result.success) {
      setSuccessMessage(
        selectedFormat === 'pdf'
          ? 'PDF report generated successfully!'
          : 'JSON data exported successfully!'
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1400);
    } else {
      Alert.alert('Export Failed', result.error || 'Unable to export report. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-sm shadow-card dark:shadow-none border border-neutral-200 dark:border-transparent">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800/50 items-center justify-center mr-3">
                    <Download size={20} color={colors.primary[600]} />
                  </View>
                  <View>
                    <Text className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-100">
                      Export Report
                    </Text>
                    <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400">
                      Formal OJT progress summary
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  disabled={isExporting}
                  style={{ minHeight: 44, minWidth: 44 }}
                  className="items-center justify-center -mr-2"
                >
                  <X size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>

              {successMessage ? (
                <View className="py-6 items-center justify-center">
                  <View className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl items-center justify-center mb-3 border border-emerald-100">
                    <CheckCircle2 size={30} color={colors.success.DEFAULT} strokeWidth={2.5} />
                  </View>
                  <Text className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-100 text-center">
                    {successMessage}
                  </Text>
                </View>
              ) : (
                <>
                  <Text className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-2 mb-4 leading-4">
                    Choose a format for your formal OJT progress documentation:
                  </Text>

                  {/* Format Options */}
                  <View className="space-y-3 mb-6">
                    {/* Option 1: PDF */}
                    <TouchableOpacity
                      onPress={() => setSelectedFormat('pdf')}
                      activeOpacity={0.75}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: selectedFormat === 'pdf' }}
                      style={[
                        { minHeight: 64 },
                        selectedFormat === 'pdf' && {
                          backgroundColor: '#EFF6FF',
                          borderColor: colors.primary[500],
                        },
                      ]}
                      className={`p-3.5 rounded-2xl border flex-row items-center ${
                        selectedFormat === 'pdf'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/40'
                          : 'border-neutral-200 dark:border-transparent bg-neutral-50 dark:bg-neutral-900'
                      }`}
                    >
                      <View
                        className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${
                          selectedFormat === 'pdf'
                            ? 'bg-primary-600'
                            : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-transparent'
                        }`}
                      >
                        <FileText
                          size={18}
                          color={selectedFormat === 'pdf' ? '#FFFFFF' : colors.neutral[600]}
                        />
                      </View>
                      <View className="flex-1 mr-2">
                        <Text
                          className={`text-xs font-bold font-sans ${
                            selectedFormat === 'pdf' ? 'text-primary-900' : 'text-neutral-900 dark:text-neutral-100'
                          }`}
                        >
                          PDF Document (.pdf)
                        </Text>
                        <Text className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400 mt-0.5" numberOfLines={1}>
                          Print-friendly report with signatures
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Option 2: JSON */}
                    <TouchableOpacity
                      onPress={() => setSelectedFormat('json')}
                      activeOpacity={0.75}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: selectedFormat === 'json' }}
                      style={[
                        { minHeight: 64 },
                        selectedFormat === 'json' && {
                          backgroundColor: '#EFF6FF',
                          borderColor: colors.primary[500],
                        },
                      ]}
                      className={`p-3.5 rounded-2xl border flex-row items-center mt-2.5 ${
                        selectedFormat === 'json'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/40'
                          : 'border-neutral-200 dark:border-transparent bg-neutral-50 dark:bg-neutral-900'
                      }`}
                    >
                      <View
                        className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${
                          selectedFormat === 'json'
                            ? 'bg-primary-600'
                            : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-transparent'
                        }`}
                      >
                        <FileCode
                          size={18}
                          color={selectedFormat === 'json' ? '#FFFFFF' : colors.neutral[600]}
                        />
                      </View>
                      <View className="flex-1 mr-2">
                        <Text
                          className={`text-xs font-bold font-sans ${
                            selectedFormat === 'json' ? 'text-primary-900' : 'text-neutral-900 dark:text-neutral-100'
                          }`}
                        >
                          JSON Data File (.json)
                        </Text>
                        <Text className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400 mt-0.5" numberOfLines={1}>
                          Structured data backup of OJT summary
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Actions */}
                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      onPress={onClose}
                      disabled={isExporting}
                      activeOpacity={0.75}
                      style={{ minHeight: 46 }}
                      className="flex-1 mr-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl items-center justify-center"
                    >
                      <Text className="text-xs font-bold font-sans text-neutral-700 dark:text-neutral-300">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleExportPress}
                      disabled={isExporting}
                      activeOpacity={0.8}
                      style={{ minHeight: 46 }}
                      className="flex-1 ml-2 bg-primary-600 rounded-xl items-center justify-center flex-row shadow-soft-sm dark:shadow-none"
                    >
                      {isExporting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Download size={14} color="#FFFFFF" strokeWidth={2.5} />
                          <Text className="text-xs font-bold font-sans text-white ml-1.5">
                            Generate
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ReportExportModal;
