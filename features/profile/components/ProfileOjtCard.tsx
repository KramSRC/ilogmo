/**
 * iLogMo - ProfileOjtCard Component
 * Read-only summary of the student's active OJT configuration.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Building2, Briefcase, Clock, Calendar, ChevronRight } from 'lucide-react-native';
import { format, parseISO, isValid } from 'date-fns';
import { OjtRecord } from '@/features/ojt/types';
import { colors } from '@/constants/colors';

export interface ProfileOjtCardProps {
  ojtRecord: OjtRecord | null;
  onViewDetails: () => void;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'Not set';
  try {
    const parsed = parseISO(dateStr);
    if (isValid(parsed)) {
      return format(parsed, 'MMMM d, yyyy');
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function ProfileOjtCard({ ojtRecord, onViewDetails }: ProfileOjtCardProps) {
  if (!ojtRecord) {
    return (
      <View className="bg-white rounded-card p-5 mb-4 shadow-card border border-neutral-200">
        <Text className="text-base font-bold font-sans text-neutral-900 mb-2">OJT Information</Text>
        <Text className="text-xs font-sans text-neutral-500 mb-3">
          No active OJT setup found. Configure your internship to track hours and attendance.
        </Text>
        <TouchableOpacity
          onPress={onViewDetails}
          activeOpacity={0.8}
          className="bg-primary-50 border border-primary-200 py-2.5 rounded-xl items-center"
        >
          <Text className="text-xs font-semibold font-sans text-primary-700">
            Set up OJT Program
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-card p-5 mb-4 shadow-card border border-neutral-200">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <Text className="text-base font-bold font-sans text-neutral-900">OJT Information</Text>
        <View className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
          <Text className="text-[10px] font-bold font-sans text-emerald-700">Active</Text>
        </View>
      </View>

      {/* Fields */}
      <View className="space-y-3">
        {/* Company */}
        <View className="flex-row items-center py-1 border-b border-neutral-100">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <Building2 size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Company / Organization</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">
              {ojtRecord.companyName}
            </Text>
          </View>
        </View>

        {/* Position / Department */}
        <View className="flex-row items-center py-1 border-b border-neutral-100">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <Briefcase size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Department / Role</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">
              {ojtRecord.department}
            </Text>
          </View>
        </View>

        {/* Required Hours */}
        <View className="flex-row items-center py-1 border-b border-neutral-100">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <Clock size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Required Hours</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">
              {ojtRecord.requiredHours} hours
            </Text>
          </View>
        </View>

        {/* Start Date */}
        <View className="flex-row items-center py-1 border-b border-neutral-100">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <Calendar size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Start Date</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">
              {formatDate(ojtRecord.startDate)}
            </Text>
          </View>
        </View>

        {/* Expected End Date */}
        <View className="flex-row items-center pt-1 mb-3">
          <View className="w-8 h-8 rounded-lg bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
            <Calendar size={15} color={colors.neutral[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-sans text-neutral-400">Expected End Date</Text>
            <Text className="text-sm font-medium font-sans text-neutral-800">
              {formatDate(ojtRecord.expectedEndDate)}
            </Text>
          </View>
        </View>
      </View>

      {/* Action: View OJT Details */}
      <TouchableOpacity
        onPress={onViewDetails}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel="View OJT Details"
        className="flex-row items-center justify-center bg-neutral-50 border border-neutral-200 py-2.5 rounded-xl"
      >
        <Text className="text-xs font-semibold font-sans text-neutral-700 mr-1">
          View OJT Details
        </Text>
        <ChevronRight size={14} color={colors.neutral[500]} />
      </TouchableOpacity>
    </View>
  );
}

export default ProfileOjtCard;
