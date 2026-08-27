/**
 * iLogMo - DocumentCard Component
 * Displays a single document card with file icon, category badge, name, size, type, and upload date.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  File,
  ChevronRight,
  MoreVertical,
} from 'lucide-react-native';
import { Document } from '../types';
import {
  formatFileSize,
  formatUploadDate,
  getFileTypeDetails,
  CATEGORY_LABELS,
} from '../utils/documentUtils';
import { colors } from '@/constants/colors';

export interface DocumentCardProps {
  document: Document;
  onPress: (document: Document) => void;
  onOptionsPress?: (document: Document) => void;
}

export function DocumentCard({ document, onPress, onOptionsPress }: DocumentCardProps) {
  const fileDetails = getFileTypeDetails(document.fileName, document.fileType);
  const formattedSize = formatFileSize(document.fileSize);
  const formattedDate = formatUploadDate(document.createdAt);
  const categoryLabel = CATEGORY_LABELS[document.category] || document.category;

  const renderFileIcon = () => {
    switch (fileDetails.kind) {
      case 'pdf':
        return <FileText size={22} color={fileDetails.color} strokeWidth={2.2} />;
      case 'doc':
        return <FileText size={22} color={fileDetails.color} strokeWidth={2.2} />;
      case 'sheet':
        return <FileSpreadsheet size={22} color={fileDetails.color} strokeWidth={2.2} />;
      case 'slide':
        return <Presentation size={22} color={fileDetails.color} strokeWidth={2.2} />;
      case 'image':
        return <ImageIcon size={22} color={fileDetails.color} strokeWidth={2.2} />;
      default:
        return <File size={22} color={fileDetails.color} strokeWidth={2.2} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(document)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${document.name}, ${fileDetails.extension}, ${formattedSize}, ${categoryLabel} category. Uploaded ${formattedDate}`}
      className="bg-white rounded-card p-4 mb-3 shadow-card border border-neutral-200"
    >
      <View className="flex-row items-start justify-between">
        {/* Left: File Icon + Details */}
        <View className="flex-row items-start flex-1 mr-3">
          {/* File Icon Badge */}
          <View
            className={`w-11 h-11 rounded-2xl ${fileDetails.bg} border items-center justify-center mr-3 mt-0.5`}
          >
            {renderFileIcon()}
          </View>

          {/* Text Content */}
          <View className="flex-1">
            {/* Document Title */}
            <Text
              className="text-base font-bold font-sans text-neutral-900 leading-snug mb-1"
              numberOfLines={2}
            >
              {document.name}
            </Text>

            {/* Category Pill */}
            <View className="flex-row items-center mb-1.5">
              <View className="bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-100">
                <Text className="text-[11px] font-semibold font-sans text-primary-700">
                  {categoryLabel}
                </Text>
              </View>
            </View>

            {/* File Meta: Type · Size */}
            <Text className="text-xs font-medium font-sans text-neutral-500 mb-0.5">
              {fileDetails.badge} · {formattedSize}
            </Text>

            {/* Uploaded Date */}
            <Text className="text-[11px] font-sans text-neutral-400">Uploaded {formattedDate}</Text>
          </View>
        </View>

        {/* Right: Action Chevron or More Button */}
        <View className="items-center justify-center mt-1">
          {onOptionsPress ? (
            <TouchableOpacity
              onPress={() => onOptionsPress(document)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Document options"
              className="w-8 h-8 rounded-full items-center justify-center"
            >
              <MoreVertical size={18} color={colors.neutral[400]} />
            </TouchableOpacity>
          ) : (
            <View className="w-8 h-8 rounded-full bg-neutral-50 items-center justify-center border border-neutral-100">
              <ChevronRight size={16} color={colors.neutral[400]} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default DocumentCard;
