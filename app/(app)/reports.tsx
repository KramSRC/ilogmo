/**
 * iLogMo - Reports Screen
 * Formal OJT progress summary with dynamic date filtering, comprehensive metrics breakdown,
 * and client-side PDF/JSON report exporting.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Download } from 'lucide-react-native';
import {
  useReports,
  ReportFilterTabs,
  ReportProgressCard,
  ReportOjtSection,
  ReportAttendanceSection,
  ReportTaskSection,
  ReportJournalSection,
  ReportExportModal,
  ReportSkeleton,
} from '@/features/reports';
import { ErrorMessage, Button } from '@/components';
import { colors } from '@/constants/colors';

export default function ReportsScreen() {
  const router = useRouter();
  const {
    report,
    filter,
    setFilter,
    isLoading,
    isRefreshing,
    isExporting,
    error,
    refresh,
    exportReport,
  } = useReports();

  const [isExportModalVisible, setIsExportModalVisible] = useState<boolean>(false);

  return (
    <SafeAreaView className="flex-1 bg-background-app" edges={['top', 'left', 'right']}>
      {/* 1. Header Bar */}
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-neutral-100 bg-white">
        <View className="flex-row items-center flex-1 mr-2">
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)');
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
            <Text className="text-xl font-bold font-sans text-neutral-900 tracking-tight">
              Reports
            </Text>
            <Text className="text-xs font-sans text-neutral-500">
              View and export your OJT progress
            </Text>
          </View>
        </View>

        {/* Quick Export Header Button */}
        {report ? (
          <TouchableOpacity
            onPress={() => setIsExportModalVisible(true)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Export OJT report"
            style={{ minHeight: 44 }}
            className="flex-row items-center bg-primary-50 border border-primary-200 px-3.5 py-2 rounded-xl"
          >
            <Download size={15} color={colors.primary[600]} strokeWidth={2.4} />
            <Text className="text-xs font-bold font-sans text-primary-700 ml-1.5">Export</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary[600]}
            colors={[colors.primary[600]]}
          />
        }
        className="px-5 pt-3"
      >
        {/* Error Banner */}
        {error ? (
          <View className="mb-4">
            <ErrorMessage message={error} type="error" />
            <Button
              title="Try Again"
              onPress={refresh}
              variant="outline"
              size="sm"
              className="mt-2"
            />
          </View>
        ) : null}

        {/* Loading State */}
        {isLoading && !isRefreshing ? (
          <ReportSkeleton />
        ) : report ? (
          <>
            {/* 2. Filter Tabs (All Time / This Month / This Week) */}
            <ReportFilterTabs selectedFilter={filter} onSelectFilter={setFilter} />

            {/* 3. Visual OJT Progress Card */}
            <ReportProgressCard hours={report.hours} dateRangeDisplay={report.dateRangeDisplay} />

            {/* 4. OJT Summary Section */}
            <ReportOjtSection ojt={report.ojt} hours={report.hours} />

            {/* 5. Attendance Summary Section */}
            <ReportAttendanceSection attendance={report.attendance} />

            {/* 6. Tasks Summary Section */}
            <ReportTaskSection tasks={report.tasks} />

            {/* 7. Journal Summary Section */}
            <ReportJournalSection
              journal={report.journal}
              documentsCount={report.documentsCount}
            />

            {/* 8. Export Action Banner */}
            <View className="bg-white rounded-card p-5 shadow-card border border-neutral-200 mt-1 mb-3 items-center">
              <Text className="text-sm font-bold font-sans text-neutral-900 mb-1">
                Formal Progress Report
              </Text>
              <Text className="text-xs font-sans text-neutral-500 text-center mb-4 leading-4 px-2">
                Generate an official PDF copy with verification signature blocks or download structured JSON records.
              </Text>

              <TouchableOpacity
                onPress={() => setIsExportModalVisible(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Export OJT report"
                style={{ minHeight: 48 }}
                className="w-full bg-primary-600 rounded-xl items-center justify-center flex-row shadow-soft-sm"
              >
                <Download size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text className="text-sm font-bold font-sans text-white ml-2">
                  Export OJT Report
                </Text>
              </TouchableOpacity>

              <Text className="text-[11px] font-sans text-neutral-400 mt-3">
                Generated: {report.generatedDateDisplay}
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Export Modal */}
      <ReportExportModal
        visible={isExportModalVisible}
        onClose={() => setIsExportModalVisible(false)}
        onExport={exportReport}
        isExporting={isExporting}
      />
    </SafeAreaView>
  );
}
