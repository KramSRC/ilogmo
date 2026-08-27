import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
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

  // Parse existing value or fallback to today
  const selectedDate = value && isValid(parseISO(value)) ? parseISO(value) : new Date();
  const displayFormatted =
    value && isValid(parseISO(value)) ? format(parseISO(value), 'MMMM d, yyyy') : '';

  const handleChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (date) {
        onChangeDate(format(date, 'yyyy-MM-dd'));
      }
    } else {
      if (date) {
        onChangeDate(format(date, 'yyyy-MM-dd'));
      }
    }
  };

  const handleClear = () => {
    onChangeDate('');
  };

  return (
    <View className={`w-full ${containerClassName}`}>
      {label ? (
        <Text className="text-xs font-semibold font-sans text-neutral-700 mb-1.5">{label}</Text>
      ) : null}

      <TouchableOpacity
        onPress={() => {
          if (!disabled) setShowPicker(true);
        }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={label || 'Select date'}
        disabled={disabled}
        className={`w-full flex-row items-center justify-between rounded-xl px-3.5 py-3 border bg-white ${
          error
            ? 'border-error ring-1 ring-error/20'
            : 'border-neutral-200 focus:border-primary-600'
        } ${disabled ? 'opacity-50 bg-neutral-50' : ''}`}
      >
        <View className="flex-row items-center flex-1 mr-2">
          <Calendar size={18} color={colors.neutral[400]} />
          <Text
            className={`ml-2.5 text-sm font-sans flex-1 ${
              displayFormatted ? 'text-neutral-900 font-medium' : 'text-neutral-400'
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
            className="w-5 h-5 rounded-full bg-neutral-100 items-center justify-center mr-1"
          >
            <X size={12} color={colors.neutral[500]} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      {error ? (
        <Text className="text-xs text-error font-sans mt-1">{error}</Text>
      ) : helperText ? (
        <Text className="text-xs text-neutral-500 font-sans mt-1">{helperText}</Text>
      ) : null}

      {/* Android Picker */}
      {Platform.OS === 'android' && showPicker ? (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleChange}
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
            <View className="bg-white rounded-t-3xl p-5 pb-8 shadow-card border-t border-neutral-200">
              <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-neutral-100">
                <Text className="text-base font-bold font-sans text-neutral-900">
                  {label || 'Select Date'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  className="px-3 py-1 bg-primary-50 rounded-lg"
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
                onChange={handleChange}
                textColor={colors.neutral[900]}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default DatePickerInput;
