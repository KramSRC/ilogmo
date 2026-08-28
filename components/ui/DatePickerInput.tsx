import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';
import { format, parseISO, isValid } from 'date-fns';
import { colors } from '@/constants/colors';

export interface DatePickerInputProps {
  label?: string;
  value?: string; // ISO date string 'YYYY-MM-DD'
  onChangeDate: (dateStr: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  clearable?: boolean;
  containerClassName?: string;
}

/**
 * Safely parses YYYY-MM-DD into a local Date object without timezone offset bugs.
 */
function parseDateValue(value?: string): Date {
  if (!value) return new Date();
  const parts = value.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    if (isValid(date)) return date;
  }
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : new Date();
}

/**
 * Formats YYYY-MM-DD into a display string (e.g. "August 28, 2026").
 */
function formatDateDisplay(value?: string): string {
  if (!value) return '';
  try {
    const date = parseDateValue(value);
    return format(date, 'MMMM d, yyyy');
  } catch {
    return value;
  }
}

export function DatePickerInput({
  label,
  value,
  onChangeDate,
  placeholder = 'Select date',
  minDate,
  maxDate,
  error,
  helperText,
  disabled = false,
  clearable = false,
  containerClassName = '',
}: DatePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedDate = parseDateValue(value);
  const displayFormatted = formatDateDisplay(value);

  const handleValueChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && date) {
      onChangeDate(format(date, 'yyyy-MM-dd'));
    } else if (Platform.OS === 'ios' && date) {
      onChangeDate(format(date, 'yyyy-MM-dd'));
    }
  };

  const handleDismiss = () => {
    setShowPicker(false);
  };

  const handleClear = () => {
    onChangeDate('');
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
        accessibilityLabel={label || 'Select date'}
        disabled={disabled}
        className="w-full flex-row items-center justify-between rounded-xl px-3.5 py-3 border bg-white dark:bg-neutral-900"
        style={[
          styles.container,
          error ? styles.errorBorder : styles.normalBorder,
          disabled && styles.disabledStyle,
        ]}
      >
        <View className="flex-row items-center flex-1 mr-2">
          <Calendar size={18} color={colors.neutral[400]} />
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

      {/* Android Picker */}
      {Platform.OS === 'android' && showPicker ? (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleValueChange}
          onDismiss={handleDismiss}
        />
      ) : null}

      {/* iOS Modal Picker */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent
          animationType="fade"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View className="flex-1 bg-black/40 justify-end">
            <View className="bg-white dark:bg-neutral-900 rounded-t-3xl p-5 pb-8 shadow-card border-t border-neutral-200 dark:border-neutral-800">
              <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <Text className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-100">
                  {label || 'Select Date'}
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
                mode="date"
                display="spinner"
                minimumDate={minDate}
                maximumDate={maxDate}
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

export default DatePickerInput;
