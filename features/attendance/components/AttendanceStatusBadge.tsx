import React from 'react';
import { View, Text } from 'react-native';
import { Check, Clock, AlertCircle, Calendar } from 'lucide-react-native';
import { AttendanceStatus } from '../types';
import { colors } from '@/constants/colors';

export interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  size?: 'sm' | 'md';
}

export function AttendanceStatusBadge({ status, size = 'sm' }: AttendanceStatusBadgeProps) {
  let bg = 'bg-neutral-100 border-neutral-200';
  let textColor = 'text-neutral-600';
  let label = 'Day Off';
  let icon = <Calendar size={12} color={colors.neutral[500]} />;

  switch (status) {
    case 'working':
      bg = 'bg-emerald-50 border-emerald-200';
      textColor = 'text-emerald-700';
      label = 'Working';
      icon = <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />;
      break;
    case 'completed':
    case 'present':
      bg = 'bg-emerald-50 border-emerald-200';
      textColor = 'text-emerald-700';
      label = status === 'completed' ? 'Completed' : 'Present';
      icon = <Check size={12} color={colors.success.DEFAULT} strokeWidth={2.5} />;
      break;
    case 'late':
      bg = 'bg-amber-50 border-amber-200';
      textColor = 'text-amber-700';
      label = 'Late';
      icon = <Clock size={12} color={colors.warning.DEFAULT} />;
      break;
    case 'absent':
      bg = 'bg-red-50 border-red-200';
      textColor = 'text-red-700';
      label = 'Absent';
      icon = <AlertCircle size={12} color={colors.error.DEFAULT} />;
      break;
    case 'day_off':
    default:
      bg = 'bg-neutral-100 border-neutral-200';
      textColor = 'text-neutral-600';
      label = 'Day Off';
      icon = <Calendar size={12} color={colors.neutral[500]} />;
      break;
  }

  const isMd = size === 'md';

  return (
    <View
      className={`flex-row items-center rounded-full border ${bg} ${
        isMd ? 'px-3 py-1' : 'px-2.5 py-0.5'
      }`}
    >
      <View className="mr-1.5">{icon}</View>
      <Text
        className={`font-semibold font-sans capitalize ${textColor} ${
          isMd ? 'text-xs' : 'text-[11px]'
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export default AttendanceStatusBadge;
