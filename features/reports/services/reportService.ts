/**
 * iLogMo - Reports Service
 * Handles data aggregation, analytics metric reuse, formal report computation,
 * and PDF/JSON report generation and sharing.
 */

import { Share, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  format,
  parseISO,
  isValid,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import { supabase } from '@/lib/supabase';
import { analyticsService } from '@/features/analytics/services/analyticsService';
import { AttendanceRecord } from '@/features/attendance/types';
import { OjtRecord } from '@/features/ojt/types';
import { Task } from '@/features/tasks/types';
import { JournalEntry } from '@/features/journal/types';
import { formatFullName } from '@/features/profile';
import { formatHoursMinutes, getTodayDateString } from '@/features/attendance/utils/timeUtils';
import {
  ReportSummary,
  ReportFilter,
  ReportHoursSummary,
  ReportOjtSummary,
  ReportAttendanceSummary,
  ReportTaskSummary,
  ReportJournalSummary,
  ReportStudentInfo,
  ReportActionResult,
} from '../types';

export interface RawReportData {
  profile: any;
  activeOjt: OjtRecord | null;
  attendance: AttendanceRecord[];
  tasks: Task[];
  journals: JournalEntry[];
  documentsCount: number;
}

function mapRowToAttendanceRecord(row: any): AttendanceRecord {
  return {
    id: row.id,
    userId: row.user_id,
    attendanceDate: row.attendance_date,
    checkIn: row.check_in,
    checkOut: row.check_out,
    breakMinutes: row.break_minutes ?? 0,
    totalMinutes: row.total_minutes,
    status: row.status,
    notes: row.notes,
    latitude: row.latitude,
    longitude: row.longitude,
    locationAccuracy: row.location_accuracy,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRowToTask(row: any): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description || null,
    dueDate: row.due_date || null,
    priority: (row.priority as Task['priority']) || 'medium',
    completed: Boolean(row.completed),
    completedAt: row.completed_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRowToJournalEntry(row: any): JournalEntry {
  return {
    id: row.id,
    userId: row.user_id,
    entryDate: row.entry_date,
    workDescription: row.work_description,
    learningDescription: row.learning_description,
    challenges: row.challenges || null,
    notes: row.notes || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRowToOjtRecord(row: any): OjtRecord {
  return {
    id: row.id,
    userId: row.user_id,
    requiredHours: row.required_hours,
    startDate: row.start_date,
    expectedEndDate: row.expected_end_date || null,
    companyName: row.company_name,
    department: row.department,
    supervisorName: row.supervisor_name || null,
    companyAddress: row.company_address || null,
    workingDays: row.working_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    expectedStartTime: row.expected_start_time || null,
    expectedEndTime: row.expected_end_time || null,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const reportService = {
  /**
   * Fetch all raw domain records concurrently for the authenticated user ID.
   * Excludes any sensitive auth tokens or passwords.
   */
  async fetchRawReportData(userId: string): Promise<ReportActionResult<RawReportData>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const [profileRes, ojtRes, attendanceRes, tasksRes, journalsRes, docsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('ojt_records').select('*').eq('user_id', userId).eq('is_active', true).maybeSingle(),
        supabase.from('attendance').select('*').eq('user_id', userId).order('attendance_date', { ascending: true }),
        supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('journal_entries').select('*').eq('user_id', userId).order('entry_date', { ascending: false }),
        supabase.from('documents').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      ]);

      const activeOjt = ojtRes.data ? mapRowToOjtRecord(ojtRes.data) : null;
      const attendance = (attendanceRes.data || []).map(mapRowToAttendanceRecord);
      const tasks = (tasksRes.data || []).map(mapRowToTask);
      const journals = (journalsRes.data || []).map(mapRowToJournalEntry);
      const documentsCount = docsRes.count ?? 0;

      return {
        success: true,
        data: {
          profile: profileRes.data,
          activeOjt,
          attendance,
          tasks,
          journals,
          documentsCount,
        },
      };
    } catch (err: any) {
      console.warn('[reportService.fetchRawReportData] Error:', err);
      return {
        success: false,
        error: err?.message || 'Unable to load report data.',
      };
    }
  },

  /**
   * Calculates the full formal ReportSummary using existing analytics algorithms.
   */
  calculateReportSummary(raw: RawReportData, filter: ReportFilter): ReportSummary {
    const now = new Date();
    const todayStr = getTodayDateString(now);

    // 1. Determine Interval bounds based on filter
    let filterLabel = 'All Time';
    let dateRangeDisplay = 'All recorded OJT activity';

    let intervalStart: Date | null = null;
    let intervalEnd: Date | null = null;

    if (filter === 'month') {
      filterLabel = 'This Month';
      intervalStart = startOfMonth(now);
      intervalEnd = endOfMonth(now);
      dateRangeDisplay = format(now, 'MMMM yyyy');
    } else if (filter === 'week') {
      filterLabel = 'This Week';
      intervalStart = startOfWeek(now, { weekStartsOn: 1 });
      intervalEnd = endOfWeek(now, { weekStartsOn: 1 });
      dateRangeDisplay = `${format(intervalStart, 'MMM d')} – ${format(intervalEnd, 'MMM d, yyyy')}`;
    }

    // 2. Filter Attendance Records for period (if applicable)
    let filteredAttendance = raw.attendance;
    if (intervalStart && intervalEnd) {
      filteredAttendance = raw.attendance.filter((r) => {
        try {
          const d = parseISO(r.attendanceDate);
          return isWithinInterval(d, { start: intervalStart!, end: intervalEnd! });
        } catch {
          return false;
        }
      });
    }

    // 3. Filter Tasks for period (by due date or creation date if filtered)
    let filteredTasks = raw.tasks;
    if (intervalStart && intervalEnd) {
      filteredTasks = raw.tasks.filter((t) => {
        try {
          const dateToCheck = t.dueDate ? parseISO(t.dueDate) : parseISO(t.createdAt);
          return isWithinInterval(dateToCheck, { start: intervalStart!, end: intervalEnd! });
        } catch {
          return false;
        }
      });
    }

    // 4. Filter Journals for period
    let filteredJournals = raw.journals;
    if (intervalStart && intervalEnd) {
      filteredJournals = raw.journals.filter((j) => {
        try {
          const d = parseISO(j.entryDate);
          return isWithinInterval(d, { start: intervalStart!, end: intervalEnd! });
        } catch {
          return false;
        }
      });
    }

    // =========================================================================
    // SECTION A: Student Information
    // =========================================================================
    const fullName = formatFullName(raw.profile?.first_name, raw.profile?.last_name);
    const student: ReportStudentInfo = {
      id: raw.profile?.id || '',
      fullName: fullName || 'Student Trainee',
      email: raw.profile?.email || '',
      studentId: raw.profile?.student_id || null,
      username: raw.profile?.username || null,
    };

    // =========================================================================
    // SECTION B: OJT Information
    // =========================================================================
    let ojt: ReportOjtSummary | null = null;
    if (raw.activeOjt) {
      let startDateFormatted = raw.activeOjt.startDate;
      try {
        const parsedStart = parseISO(raw.activeOjt.startDate);
        if (isValid(parsedStart)) {
          startDateFormatted = format(parsedStart, 'MMMM d, yyyy');
        }
      } catch {}

      let expectedEndDateFormatted: string | null = null;
      if (raw.activeOjt.expectedEndDate) {
        try {
          const parsedEnd = parseISO(raw.activeOjt.expectedEndDate);
          if (isValid(parsedEnd)) {
            expectedEndDateFormatted = format(parsedEnd, 'MMMM d, yyyy');
          }
        } catch {}
      }

      let expectedHoursPerDay: string | null = null;
      if (raw.activeOjt.expectedStartTime && raw.activeOjt.expectedEndTime) {
        expectedHoursPerDay = `${raw.activeOjt.expectedStartTime} – ${raw.activeOjt.expectedEndTime}`;
      }

      ojt = {
        companyName: raw.activeOjt.companyName,
        department: raw.activeOjt.department,
        supervisorName: raw.activeOjt.supervisorName || null,
        companyAddress: raw.activeOjt.companyAddress || null,
        startDateFormatted,
        expectedEndDateFormatted,
        workingDays: raw.activeOjt.workingDays,
        expectedHoursPerDay,
      };
    }

    // =========================================================================
    // SECTION C: Hours Summary (Reusing Analytics algorithm)
    // =========================================================================
    // Note: Total OJT hours progress is cumulative across all records to show real completion status
    const overallProgress = analyticsService.calculateOverallProgress(raw.attendance, raw.activeOjt);
    const completedHoursDecimal = Number((overallProgress.completedMinutes / 60).toFixed(1));
    const remainingHoursDecimal = Number((overallProgress.remainingMinutes / 60).toFixed(1));

    const hours: ReportHoursSummary = {
      requiredHours: overallProgress.requiredHours,
      completedMinutes: overallProgress.completedMinutes,
      completedHoursFormatted: overallProgress.completedHoursFormatted,
      completedHoursDecimal,
      remainingMinutes: overallProgress.remainingMinutes,
      remainingHoursFormatted: overallProgress.remainingHoursFormatted,
      remainingHoursDecimal,
      progressPercentage: overallProgress.progressPercentage,
    };

    // =========================================================================
    // SECTION D: Attendance Summary (Reusing Analytics Overview)
    // =========================================================================
    const attendanceStats = analyticsService.calculateAttendanceOverview(
      filteredAttendance,
      raw.activeOjt
    );

    // Calculate missing checkout count
    let missingCheckOutCount = 0;
    filteredAttendance.forEach((r) => {
      if (r.checkIn && !r.checkOut && r.attendanceDate < todayStr) {
        missingCheckOutCount++;
      }
    });

    // Total worked minutes for the evaluated period
    let totalWorkedMinutes = 0;
    filteredAttendance.forEach((r) => {
      if (r.totalMinutes) {
        totalWorkedMinutes += r.totalMinutes;
      }
    });

    const attendance: ReportAttendanceSummary = {
      workingDaysCount: raw.activeOjt?.workingDays?.length || 5,
      presentCount: attendanceStats.presentDays,
      lateCount: attendanceStats.lateDays,
      absentCount: attendanceStats.absentDays,
      missingCheckOutCount,
      dayOffCount: attendanceStats.dayOffDays,
      totalWorkedMinutes,
      totalWorkedHoursFormatted: formatHoursMinutes(totalWorkedMinutes),
      averageMinutesPerDay: attendanceStats.averageMinutesPerDay,
      averageHoursFormatted: attendanceStats.averageHoursFormatted,
      attendanceRatePercentage: attendanceStats.attendanceRate,
      attendanceRateFormatted: attendanceStats.attendanceRateFormatted,
    };

    // =========================================================================
    // SECTION E: Task Summary
    // =========================================================================
    const totalTasks = filteredTasks.length;
    let completedTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;

    filteredTasks.forEach((t) => {
      if (t.completed) {
        completedTasks++;
      } else {
        if (t.dueDate && t.dueDate < todayStr) {
          overdueTasks++;
        } else {
          pendingTasks++;
        }
      }
    });

    const completionRatePercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const completionRateFormatted = totalTasks > 0 ? `${completionRatePercentage}%` : '--';

    const tasks: ReportTaskSummary = {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRatePercentage,
      completionRateFormatted,
    };

    // =========================================================================
    // SECTION F: Journal Summary
    // =========================================================================
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    let entriesThisWeek = 0;
    let entriesThisMonth = 0;

    raw.journals.forEach((j) => {
      try {
        const d = parseISO(j.entryDate);
        if (isWithinInterval(d, { start: weekStart, end: weekEnd })) {
          entriesThisWeek++;
        }
        if (isWithinInterval(d, { start: monthStart, end: monthEnd })) {
          entriesThisMonth++;
        }
      } catch {}
    });

    let latestEntryDateFormatted: string | null = null;
    if (raw.journals.length > 0) {
      try {
        const latest = raw.journals[0];
        const parsedLatest = parseISO(latest.entryDate);
        if (isValid(parsedLatest)) {
          latestEntryDateFormatted = format(parsedLatest, 'MMMM d, yyyy');
        }
      } catch {}
    }

    const journal: ReportJournalSummary = {
      totalEntries: filteredJournals.length,
      entriesThisWeek,
      entriesThisMonth,
      latestEntryDateFormatted,
    };

    return {
      generatedAt: now.toISOString(),
      generatedDateDisplay: format(now, 'MMMM d, yyyy'),
      filter,
      filterLabel,
      dateRangeDisplay,
      student,
      ojt,
      hours,
      attendance,
      tasks,
      journal,
      documentsCount: raw.documentsCount,
    };
  },

  /**
   * Generates a clean, professional, print-friendly HTML document for PDF generation.
   */
  generateHtmlReport(summary: ReportSummary): string {
    const ojtCompany = summary.ojt?.companyName || 'Not Set';
    const ojtDepartment = summary.ojt?.department || 'Not Set';
    const ojtSupervisor = summary.ojt?.supervisorName || 'Not Specified';
    const ojtAddress = summary.ojt?.companyAddress || 'Not Specified';
    const ojtStartDate = summary.ojt?.startDateFormatted || 'Not Set';
    const ojtEndDate = summary.ojt?.expectedEndDateFormatted || 'Flexible';
    const workingDays = summary.ojt?.workingDays?.join(', ') || 'Monday - Friday';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>iLogMo OJT Progress Report</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: #ffffff;
      color: #0f172a;
      padding: 36px 40px;
      line-height: 1.5;
      font-size: 13px;
    }
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand-title span {
      color: #2563eb;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
      font-weight: 500;
    }
    .meta-info {
      text-align: right;
    }
    .meta-date {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }
    .meta-filter {
      display: inline-block;
      margin-top: 4px;
      padding: 2px 8px;
      background-color: #eff6ff;
      color: #1d4ed8;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #475569;
      margin-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 22px;
    }
    .card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
    }
    .card-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 12px;
    }
    .row-label {
      color: #64748b;
    }
    .row-value {
      font-weight: 600;
      color: #0f172a;
      text-align: right;
    }

    /* Progress Banner */
    .progress-banner {
      background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
      color: #ffffff;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .progress-left {
      flex: 1;
    }
    .progress-headline {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .progress-subtext {
      font-size: 12px;
      opacity: 0.85;
    }
    .progress-pct {
      font-size: 32px;
      font-weight: 800;
      margin-left: 24px;
      letter-spacing: -1px;
    }

    /* Metrics Grid */
    .metrics-3col {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 22px;
    }
    .metric-card {
      border: 1px solid #e2e8f0;
      background: #ffffff;
      border-radius: 8px;
      padding: 12px 14px;
      text-align: center;
    }
    .metric-val {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin: 4px 0 2px;
    }
    .metric-lbl {
      font-size: 10.5px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
    }

    /* Signatures */
    .signatures {
      margin-top: 36px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      page-break-inside: avoid;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      padding-top: 6px;
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      color: #334155;
    }
    .sig-space {
      height: 48px;
    }

    .footer {
      margin-top: 32px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- 1. Header -->
  <div class="header">
    <div>
      <div class="brand-title">iLog<span>Mo</span></div>
      <div class="brand-subtitle">Official On-the-Job Training Progress Report</div>
    </div>
    <div class="meta-info">
      <div class="meta-date">Generated: ${summary.generatedDateDisplay}</div>
      <div class="meta-filter">Range: ${summary.filterLabel}</div>
    </div>
  </div>

  <!-- 2. Overall Progress Banner -->
  <div class="progress-banner">
    <div class="progress-left">
      <div class="progress-headline">OJT Completion Status</div>
      <div class="progress-subtext">
        <strong>${summary.hours.completedHoursFormatted}</strong> of ${summary.hours.requiredHours} required hours completed 
        (${summary.hours.remainingHoursFormatted} remaining)
      </div>
    </div>
    <div class="progress-pct">${summary.hours.progressPercentage}%</div>
  </div>

  <!-- 3. Student & OJT Summary Grid -->
  <div class="info-grid">
    <!-- Student Details -->
    <div class="card">
      <div class="card-title">Student Information</div>
      <div class="row"><span class="row-label">Full Name:</span><span class="row-value">${summary.student.fullName}</span></div>
      <div class="row"><span class="row-label">Email:</span><span class="row-value">${summary.student.email}</span></div>
      ${summary.student.studentId ? `<div class="row"><span class="row-label">Student ID:</span><span class="row-value">${summary.student.studentId}</span></div>` : ''}
    </div>

    <!-- OJT Details -->
    <div class="card">
      <div class="card-title">Host Training Establishment</div>
      <div class="row"><span class="row-label">Company:</span><span class="row-value">${ojtCompany}</span></div>
      <div class="row"><span class="row-label">Department:</span><span class="row-value">${ojtDepartment}</span></div>
      <div class="row"><span class="row-label">Supervisor:</span><span class="row-value">${ojtSupervisor}</span></div>
      <div class="row"><span class="row-label">Start Date:</span><span class="row-value">${ojtStartDate}</span></div>
      <div class="row"><span class="row-label">Expected End:</span><span class="row-value">${ojtEndDate}</span></div>
    </div>
  </div>

  <!-- 4. Attendance Summary -->
  <div class="section-title">Attendance & Hours Breakdown</div>
  <div class="metrics-3col">
    <div class="metric-card">
      <div class="metric-lbl">Total Attended / Present</div>
      <div class="metric-val" style="color: #059669;">${summary.attendance.presentCount} Days</div>
      <div style="font-size: 10px; color: #64748b;">${summary.attendance.lateCount > 0 ? `(${summary.attendance.lateCount} late)` : '0 late'}</div>
    </div>
    <div class="metric-card">
      <div class="metric-lbl">Total Hours Rendered</div>
      <div class="metric-val" style="color: #2563eb;">${summary.hours.completedHoursFormatted}</div>
      <div style="font-size: 10px; color: #64748b;">Avg ${summary.attendance.averageHoursFormatted} / day</div>
    </div>
    <div class="metric-card">
      <div class="metric-lbl">Attendance Rate</div>
      <div class="metric-val" style="color: #1e293b;">${summary.attendance.attendanceRateFormatted}</div>
      <div style="font-size: 10px; color: #64748b;">${summary.attendance.absentCount} unlogged/absent</div>
    </div>
  </div>

  <!-- 5. Tasks & Journal Summary -->
  <div class="info-grid">
    <!-- Tasks Card -->
    <div class="card">
      <div class="card-title">Tasks & Deliverables</div>
      <div class="row"><span class="row-label">Total Assigned Tasks:</span><span class="row-value">${summary.tasks.totalTasks}</span></div>
      <div class="row"><span class="row-label">Completed:</span><span class="row-value" style="color: #059669;">${summary.tasks.completedTasks}</span></div>
      <div class="row"><span class="row-label">In Progress / Pending:</span><span class="row-value">${summary.tasks.pendingTasks}</span></div>
      <div class="row"><span class="row-label">Overdue:</span><span class="row-value" style="color: ${summary.tasks.overdueTasks > 0 ? '#dc2626' : '#64748b'};">${summary.tasks.overdueTasks}</span></div>
      <div class="row" style="margin-top: 4px; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
        <span class="row-label">Completion Rate:</span><span class="row-value" style="font-weight: 700;">${summary.tasks.completionRateFormatted}</span>
      </div>
    </div>

    <!-- Journal & Documents Card -->
    <div class="card">
      <div class="card-title">Journal & Documentation</div>
      <div class="row"><span class="row-label">Total Journal Logs:</span><span class="row-value">${summary.journal.totalEntries} entries</span></div>
      <div class="row"><span class="row-label">Logs This Week:</span><span class="row-value">${summary.journal.entriesThisWeek}</span></div>
      <div class="row"><span class="row-label">Logs This Month:</span><span class="row-value">${summary.journal.entriesThisMonth}</span></div>
      <div class="row"><span class="row-label">Latest Log Date:</span><span class="row-value">${summary.journal.latestEntryDateFormatted || 'None'}</span></div>
      <div class="row" style="margin-top: 4px; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
        <span class="row-label">Documents Uploaded:</span><span class="row-value">${summary.documentsCount} files</span>
      </div>
    </div>
  </div>

  <!-- 6. Formal Verification Signatures -->
  <div class="signatures">
    <div>
      <div class="sig-space"></div>
      <div class="sig-line">
        <strong>${summary.student.fullName}</strong><br>
        Student Trainee Signature / Date
      </div>
    </div>
    <div>
      <div class="sig-space"></div>
      <div class="sig-line">
        <strong>${ojtSupervisor}</strong><br>
        OJT Supervisor / Training Coordinator Signature / Date
      </div>
    </div>
  </div>

  <!-- 7. Footer -->
  <div class="footer">
    <span>iLogMo Mobile Trainee Management System</span>
    <span>Report Generated: ${summary.generatedAt}</span>
  </div>

</body>
</html>
    `.trim();
  },

  /**
   * Generates a PDF file from the HTML template and prompts the system share sheet.
   */
  async exportPdfReport(summary: ReportSummary): Promise<ReportActionResult<boolean>> {
    try {
      const html = this.generateHtmlReport(summary);

      // Generate PDF in cache
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (!uri) {
        return { success: false, error: 'Failed to generate PDF document.' };
      }

      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `iLogMo-OJT-Report-${summary.generatedDateDisplay.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        });
      } else {
        // Fallback to print sheet
        await Print.printAsync({ uri });
      }

      return { success: true, data: true };
    } catch (err: any) {
      console.warn('[reportService.exportPdfReport] PDF generation error:', err);
      return {
        success: false,
        error: err?.message || 'Unable to generate or share PDF report.',
      };
    }
  },

  /**
   * Generates and shares a sanitized JSON report payload.
   */
  async exportJsonReport(summary: ReportSummary): Promise<ReportActionResult<boolean>> {
    try {
      const payload = {
        application: 'iLogMo',
        reportVersion: '1.0',
        generatedAt: summary.generatedAt,
        filter: summary.filter,
        filterLabel: summary.filterLabel,
        student: summary.student,
        ojt: summary.ojt,
        hours: summary.hours,
        attendance: summary.attendance,
        tasks: summary.tasks,
        journal: summary.journal,
        documentsCount: summary.documentsCount,
      };

      const jsonString = JSON.stringify(payload, null, 2);
      const title = `ilogmo-ojt-report-${summary.filter}-${new Date().toISOString().slice(0, 10)}.json`;

      await Share.share(
        {
          title,
          message: jsonString,
        },
        {
          dialogTitle: 'Export iLogMo OJT Report',
          subject: title,
        }
      );

      return { success: true, data: true };
    } catch (err: any) {
      console.warn('[reportService.exportJsonReport] JSON export error:', err);
      return {
        success: false,
        error: err?.message || 'Unable to export JSON report.',
      };
    }
  },
};

export default reportService;
