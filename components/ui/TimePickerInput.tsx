import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Clock, X } from 'lucide-react-native';
import { format, setHours, setMinutes } from 'date-fns';
import { colors } from '@/constants/colors';

export interface TimePickerInputProps {
  label?: string;
  value?: string; // Time string 'HH:mm' (e.g. '08:00', '17:30')
  onChangeTime: (timeStr: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  clearable?: boolean;
  containerClassName?: string;
}

/**
 * Converts "HH:mm" to a valid Date object for today.
 */
function parseTimeStringToDate(timeStr?: string): Date {
  const base = new Date();
  if (!timeStr) return base;

  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) return base;

  return setMinutes(setHours(base, hours), minutes);
}

/**
 * Formats "HH:mm" into "h:mm a" (e.g. "8:00 AM").
 */
function formatTimeStringForDisplay(timeStr?: string): string {
  if (!timeStr) return '';
  try {
    const date = parseTimeStringToDate(timeStr);
    return format(date, 'h:mm a');
  } catch {
    return timeStr;
  }
}

export function TimePickerInput({
  label,
  value,
  onChangeTime,
  placeholder = 'Select time',
  error,
  helperText,
  disabled = false,
  clearable = false,
  containerClassName = '',
}: TimePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedDate = parseTimeStringToDate(value);
  const displayFormatted = formatTimeStringForDisplay(value);

  const handleValueChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && date) {
      onChangeTime(format(date, 'HH:mm'));
    } else if (Platform.OS === 'ios' && date) {
      onChangeTime(format(date, 'HH:mm'));
    }
  };

  const handleDismiss = () => {
    setShowPicker(false);
  };

  const handleClear = () => {
    onChangeTime('');
  };

  return (
    <View className={`w-full ${containerClassName}`}>
      {label ? (
        <Text className="text-xs font-semibold font-sans text-neutral-700 dark:text-neutral-300 mb-1.5">{label}</Text>
      ) : null}

      <TouchableOpacity
        onPress={() => {
          if (!disabled) setShowPicker(true);
        }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={label || 'Select time'}
        disabled={disabled}
        className="w-full flex-row items-center justify-between rounded-xl px-3.5 py-3 border bg-white dark:bg-neutral-900"
        style={[
          styles.container,
          error ? styles.errorBorder : styles.normalBorder,
          disabled && styles.disabledStyle,
        ]}
      >
        <View className="flex-row items-center flex-1 mr-2">
          <Clock size={16} color={colors.neutral[400]} />
          <Text
            className={`ml-2.5 text-sm font-sans flex-1 ${
              displayFormatted ? 'text-neutral-900 dark:text-neutral-100 font-medium' : 'text-neutral-400'
            }`}
            numberOfLines={1}
          >
            {displayFormatted || placeholder}
          </Text>
        </View>

        {clearable && value && !disabled ? (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center mr-1"
          >
            <X size={12} color={colors.neutral[500]} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      {error ? (
        <Text className="text-xs text-error font-sans mt-1">{error}</Text>
      ) : helperText ? (
        <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-sans mt-1">{helperText}</Text>
      ) : null}

      {/* Android Time Picker */}
      {Platform.OS === 'android' && showPicker ? (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleValueChange}
          onDismiss={handleDismiss}
        />
      ) : null}

      {/* iOS Modal Time Picker */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent
          animationType="fade"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View className="flex-1 bg-black/40 justify-end">
            <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-5 pb-8 shadow-card dark:shadow-none border-t border-neutral-200 dark:border-neutral-800">
              <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">
                  {label || 'Select Time'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  className="px-3 py-1 bg-primary-50 dark:bg-primary-900/40 rounded-lg"
                >
                  <Text className="text-sm font-semibold font-sans text-primary-600">Done</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={selectedDate}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleValueChange}
                textColor={colors.neutral[900]}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
  },
  normalBorder: {
    borderColor: '#E2E8F0',
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  disabledStyle: {
    opacity: 0.5,
    backgroundColor: '#F8FAFC',
  },
});

export default TimePickerInput;
