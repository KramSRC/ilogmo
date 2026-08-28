/**
 * iLogMo - DocumentCategoryFilter Component
 * Horizontal scrolling category pills for filtering documents.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { DocumentFilterCategory } from '../types';
import { FILTER_OPTIONS } from '../utils/documentUtils';

export interface DocumentCategoryFilterProps {
  selectedCategory: DocumentFilterCategory;
  onSelectCategory: (category: DocumentFilterCategory) => void;
  categoryCounts?: Record<string, number>;
}

export function DocumentCategoryFilter({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}: DocumentCategoryFilterProps) {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        className="-mx-5"
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = selectedCategory === option.value;
          const count = categoryCounts[option.value];

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelectCategory(option.value)}
              activeOpacity={0.75}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              className={`mr-2.5 px-3.5 py-2 rounded-xl flex-row items-center border ${
                isSelected
                  ? 'bg-primary-600 border-primary-600 shadow-soft-sm dark:shadow-none'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <Text
                className={`text-xs font-semibold font-sans ${
                  isSelected ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {option.label}
              </Text>
              {typeof count === 'number' && count > 0 ? (
                <View
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white dark:bg-neutral-900/25' : 'bg-neutral-100 dark:bg-neutral-800'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold font-sans ${
                      isSelected ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default DocumentCategoryFilter;
