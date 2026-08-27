/**
 * iLogMo - useReports Hook
 * Manages fetching, caching raw data, computing report stats with dynamic filtering,
 * and executing PDF/JSON export actions.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { reportService, RawReportData } from '../services/reportService';
import { ReportSummary, ReportFilter, ExportFormat } from '../types';

export function useReports() {
  const user = useAuthStore((state) => state.user);

  const [filter, setFilter] = useState<ReportFilter>('all');
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cached raw domain data in ref so switching filters computes instantaneously without network request
  const rawDataRef = useRef<RawReportData | null>(null);

  /**
   * Fetches fresh records from Supabase.
   */
  const loadData = useCallback(
    async (isRefreshAction: boolean = false) => {
      if (!user?.id) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (isRefreshAction) {
        setIsRefreshing(true);
      } else if (!rawDataRef.current) {
        setIsLoading(true);
      }

      setError(null);

      const result = await reportService.fetchRawReportData(user.id);
      if (result.success && result.data) {
        rawDataRef.current = result.data;
        const computed = reportService.calculateReportSummary(result.data, filter);
        setReport(computed);
      } else {
        setError(result.error || 'Unable to generate your report.');
      }

      setIsLoading(false);
      setIsRefreshing(false);
    },
    [user?.id, filter]
  );

  // Initial load
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // When filter changes, recompute immediately from cached raw data
  const handleFilterChange = useCallback((newFilter: ReportFilter) => {
    setFilter(newFilter);
    if (rawDataRef.current) {
      const computed = reportService.calculateReportSummary(rawDataRef.current, newFilter);
      setReport(computed);
    }
  }, []);

  /**
   * Pull-to-refresh handler.
   */
  const refresh = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  /**
   * Trigger export in either PDF or JSON format.
   */
  const exportReport = useCallback(
    async (format: ExportFormat): Promise<{ success: boolean; error?: string }> => {
      if (!report) {
        return { success: false, error: 'No report data available to export.' };
      }

      setIsExporting(true);
      try {
        let result;
        if (format === 'pdf') {
          result = await reportService.exportPdfReport(report);
        } else {
          result = await reportService.exportJsonReport(report);
        }
        return result;
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || 'Export failed. Please try again.',
        };
      } finally {
        setIsExporting(false);
      }
    },
    [report]
  );

  return {
    report,
    filter,
    setFilter: handleFilterChange,
    isLoading,
    isRefreshing,
    isExporting,
    error,
    refresh,
    exportReport,
  };
}

export default useReports;
