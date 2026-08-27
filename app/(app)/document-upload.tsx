/**
 * iLogMo - Document Upload Screen
 * Allows students to pick an OJT document, name it, categorize it, and upload to Supabase Storage.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { ArrowLeft, UploadCloud, FileText, CheckCircle2, X } from 'lucide-react-native';
import {
  useDocuments,
  DocumentCategory,
  PickedFile,
  CATEGORY_OPTIONS,
  MAX_FILE_SIZE_BYTES,
  formatFileSize,
  getFileTypeDetails,
  deriveDefaultDocumentName,
} from '@/features/documents';
import { Button, ErrorMessage } from '@/components';
import { colors } from '@/constants/colors';

export default function DocumentUploadScreen() {
  const router = useRouter();
  const { uploadDocument, isUploading } = useDocuments();

  // Form State
  const [selectedFile, setSelectedFile] = useState<PickedFile | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const [category, setCategory] = useState<DocumentCategory>('other');
  const [description, setDescription] = useState<string>('');

  // UI / Error State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * Handle picking a document from the device filesystem.
   */
  const handlePickDocument = async () => {
    try {
      setFormError(null);
      setErrors((prev) => ({ ...prev, file: '' }));

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'image/*',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const fileSize = asset.size || 0;

      // Validate 10MB limit
      if (fileSize > MAX_FILE_SIZE_BYTES) {
        Alert.alert(
          'File is too large',
          `The selected file is ${formatFileSize(fileSize)}. Please select a file smaller than 10 MB.`
        );
        return;
      }

      const picked: PickedFile = {
        uri: asset.uri,
        name: asset.name || 'document.pdf',
        size: fileSize,
        mimeType: asset.mimeType,
      };

      setSelectedFile(picked);

      // Auto-fill document title if blank
      if (!documentName.trim()) {
        const derived = deriveDefaultDocumentName(picked.name);
        setDocumentName(derived);
      }
    } catch (err: any) {
      console.warn('[DocumentUploadScreen] File picking error:', err);
      setFormError('Unable to select file from device. Please try again.');
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setDocumentName('');
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload.';
    }

    const cleanName = documentName.trim();
    if (!cleanName) {
      newErrors.documentName = 'Document name is required.';
    } else if (cleanName.length > 150) {
      newErrors.documentName = 'Document name cannot exceed 150 characters.';
    }

    if (!category) {
      newErrors.category = 'Please select a category.';
    }

    if (description.trim().length > 1000) {
      newErrors.description = 'Description cannot exceed 1,000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (isUploading) return;
    setFormError(null);

    if (!validateForm() || !selectedFile) {
      return;
    }

    const result = await uploadDocument({
      name: documentName.trim(),
      description: description.trim() || undefined,
      category,
      file: selectedFile,
    });

    if (result.success) {
      Alert.alert('Success', 'Document uploaded successfully.', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } else {
      setFormError(result.error || 'Unable to save this document.');
    }
  };

  const fileDetails = selectedFile
    ? getFileTypeDetails(selectedFile.name, selectedFile.mimeType)
    : null;

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 bg-white">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)/documents');
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
            <Text className="text-xl font-bold font-sans text-neutral-900">Upload Document</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          className="px-5 pt-4"
        >
          {/* Top Form Error */}
          {formError ? (
            <View className="mb-4">
              <ErrorMessage message={formError} type="error" />
            </View>
          ) : null}

          {/* 1. File Selection Area */}
          <View className="mb-5">
            <Text className="text-sm font-semibold font-sans text-neutral-800 mb-1.5">File *</Text>

            {!selectedFile ? (
              <TouchableOpacity
                onPress={handlePickDocument}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Select file to upload"
                className="bg-white rounded-2xl p-6 border-2 border-dashed border-neutral-300 items-center justify-center"
                style={errors.file ? styles.dashedBorderError : undefined}
              >
                <View className="w-14 h-14 rounded-2xl bg-primary-50 items-center justify-center mb-3">
                  <UploadCloud size={28} color={colors.primary[600]} />
                </View>
                <Text className="text-base font-bold font-sans text-neutral-900 mb-1">
                  Choose a file
                </Text>
                <Text className="text-xs font-sans text-neutral-500 text-center mb-3">
                  PDF, DOCX, XLSX, PPTX, TXT, Images
                </Text>
                <View className="bg-primary-50 px-3.5 py-1.5 rounded-lg border border-primary-100">
                  <Text className="text-xs font-semibold font-sans text-primary-700">
                    Max size: 10 MB
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              /* Selected File Card */
              <View className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-soft-sm">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1 mr-2">
                    <View
                      className={`w-11 h-11 rounded-xl ${fileDetails?.bg} border items-center justify-center mr-3`}
                    >
                      <FileText size={22} color={fileDetails?.color} strokeWidth={2.2} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-sm font-bold font-sans text-neutral-900"
                        numberOfLines={1}
                      >
                        {selectedFile.name}
                      </Text>
                      <Text className="text-xs font-sans text-neutral-500 mt-0.5">
                        {fileDetails?.badge} · {formatFileSize(selectedFile.size)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleClearFile}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="w-7 h-7 rounded-full bg-neutral-100 items-center justify-center"
                  >
                    <X size={14} color={colors.neutral[500]} />
                  </TouchableOpacity>
                </View>

                {/* Change File Button */}
                <TouchableOpacity
                  onPress={handlePickDocument}
                  activeOpacity={0.7}
                  className="bg-neutral-50 py-2 rounded-xl border border-neutral-200 items-center"
                >
                  <Text className="text-xs font-semibold font-sans text-primary-600">
                    Change File
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {errors.file ? (
              <Text className="text-xs font-sans text-red-500 mt-1">{errors.file}</Text>
            ) : null}
          </View>

          {/* 2. Document Name */}
          <View className="mb-5">
            <Text className="text-sm font-semibold font-sans text-neutral-800 mb-1.5">
              Document Name *
            </Text>
            <View
              className="bg-white rounded-xl px-3.5 py-3 border"
              style={[
                styles.inputWrapper,
                errors.documentName ? styles.inputError : styles.inputNormal,
              ]}
            >
              <TextInput
                placeholder="e.g. OJT Evaluation Form"
                placeholderTextColor={colors.neutral[400]}
                value={documentName}
                onChangeText={(text) => {
                  setDocumentName(text);
                  setErrors((prev) => ({ ...prev, documentName: '' }));
                }}
                maxLength={150}
                editable={!isUploading}
                className="text-base font-sans text-neutral-900"
              />
            </View>
            {errors.documentName ? (
              <Text className="text-xs font-sans text-red-500 mt-1">{errors.documentName}</Text>
            ) : (
              <Text className="text-[11px] font-sans text-neutral-400 mt-1 text-right">
                {documentName.length}/150
              </Text>
            )}
          </View>

          {/* 3. Category Selector */}
          <View className="mb-5">
            <Text className="text-sm font-semibold font-sans text-neutral-800 mb-2">
              Category *
            </Text>
            <View className="flex-row flex-wrap">
              {CATEGORY_OPTIONS.map((opt) => {
                const isSelected = category === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => {
                      setCategory(opt.value);
                      setErrors((prev) => ({ ...prev, category: '' }));
                    }}
                    activeOpacity={0.75}
                    className={`mr-2 mb-2.5 px-3.5 py-2 rounded-xl flex-row items-center border ${
                      isSelected
                        ? 'bg-primary-50 border-primary-600'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2
                        size={14}
                        color={colors.primary[600]}
                        style={{ marginRight: 5 }}
                      />
                    ) : null}
                    <Text
                      className={`text-xs font-semibold font-sans ${
                        isSelected ? 'text-primary-700' : 'text-neutral-700'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.category ? (
              <Text className="text-xs font-sans text-red-500 mt-0.5">{errors.category}</Text>
            ) : null}
          </View>

          {/* 4. Description (Optional) */}
          <View className="mb-6">
            <Text className="text-sm font-semibold font-sans text-neutral-800 mb-1.5">
              Description <Text className="text-neutral-400 font-normal">(Optional)</Text>
            </Text>
            <View className="bg-white rounded-2xl p-3.5 border border-neutral-200">
              <TextInput
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholder="Add a short description..."
                placeholderTextColor={colors.neutral[400]}
                value={description}
                onChangeText={setDescription}
                maxLength={1000}
                editable={!isUploading}
                className="text-base font-sans text-neutral-900 min-h-[80px]"
              />
            </View>
            {errors.description ? (
              <Text className="text-xs font-sans text-red-500 mt-1">{errors.description}</Text>
            ) : (
              <Text className="text-[11px] font-sans text-neutral-400 mt-1 text-right">
                {description.length}/1000
              </Text>
            )}
          </View>

          {/* 5. Upload Button */}
          <Button
            title="Upload Document"
            isLoading={isUploading}
            loadingText="Uploading..."
            onPress={handleUpload}
            variant="primary"
            size="lg"
            className="w-full shadow-button"
            disabled={isUploading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    minHeight: 48,
  },
  inputNormal: {
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  dashedBorderError: {
    borderColor: '#EF4444',
  },
});
