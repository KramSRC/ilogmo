/**
 * iLogMo - Calendar Service
 * Handles month-bounded attendance queries, calendar grid generation, and statistical calculations.
 */

import { supabase } from '@/lib/supabase';
import { AttendanceRecord } from '@/features/attendance/types';
import { OjtRecord, WorkingDay } from '@/features/ojt/types';
import {
  CalendarDay,
  CalendarDayStatus,
  MonthlyAttendanceSummary,
  SelectedDateDetails,
} from '../types/calendar.types';
import {
  formatHoursMinutes,
  formatTimeDisplay,
  formatDateDisplay,
  getTodayDateString,
  calculateElapsedMinutes,
} from '@/features/attendance/utils/timeUtils';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';

const DAY_NAME_MAP: Record<number, WorkingDay> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

/**
 * Maps raw Supabase row to domain AttendanceRecord.
 */
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

export const calendarService = {
  /**
   * Fetch attendance records for a specific month only.
   */
  async getMonthlyAttendanceRecords(
    userId: string,
    targetMonth: Date
  ): Promise<AttendanceRecord[]> {
    try {
      if (!userId) return [];

      const start = startOfMonth(targetMonth);
      const end = endOfMonth(targetMonth);

      const startDateStr = format(start, 'yyyy-MM-dd');
      const endDateStr = format(end, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .gte('attendance_date', startDateStr)
        .lte('attendance_date', endDateStr)
        .order('attendance_date', { ascending: true });

      if (error) {
        console.warn('[calendarService.getMonthlyAttendanceRecords] Error:', error.message);
        return [];
      }

      return (data || []).map(mapRowToAttendanceRecord);
    } catch (err) {
      console.warn('[calendarService.getMonthlyAttendanceRecords] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch overall completed attendance minutes across all records.
   */
  async getTotalCompletedMinutes(userId: string): Promise<number> {
    try {
      if (!userId) return 0;

      const { data, error } = await supabase
        .from('attendance')
        .select('total_minutes, status, check_in, break_minutes')
        .eq('user_id', userId);

      if (error || !data) return 0;

      return data.reduce((acc, row) => {
        if (row.total_minutes) {
          return acc + row.total_minutes;
        } else if (row.status === 'working' && row.check_in) {
          return acc + calculateElapsedMinutes(row.check_in, new Date(), row.break_minutes || 0);
        }
        return acc;
      }, 0);
    } catch {
      return 0;
    }
  },

  /**
   * Generates calendar day cells for the entire month grid (Sunday start).
   */
  generateCalendarGrid(
    targetMonth: Date,
    selectedDateStr: string,
    attendanceRecords: AttendanceRecord[],
    ojtRecord: OjtRecord | null
  ): CalendarDay[] {
    const monthStart = startOfMonth(targetMonth);
    const monthEnd = endOfMonth(targetMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Saturday

    const intervalDays = eachDayOfInterval({ start: gridStart, end: gridEnd });
    const today = new Date();
    const todayStr = getTodayDateString(today);

    const workingDaysSet = new Set<WorkingDay>(
      ojtRecord?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    );

    const ojtStartDate = ojtRecord?.startDate ? ojtRecord.startDate : null;
    const ojtEndDate = ojtRecord?.expectedEndDate ? ojtRecord.expectedEndDate : null;

    // Create lookup map for fast attendance record retrieval
    const recordMap = new Map<string, AttendanceRecord>();
    attendanceRecords.forEach((rec) => {
      recordMap.set(rec.attendanceDate, rec);
    });

    return intervalDays.map((d) => {
      const dateString = format(d, 'yyyy-MM-dd');
      const dayNumber = d.getDate();
      const isCurrentMonth = isSameMonth(d, targetMonth);
      const isToday = isSameDay(d, today);
      const isSelected = dateString === selectedDateStr;

      const dayOfWeekIndex = d.getDay();
      const dayOfWeekName = DAY_NAME_MAP[dayOfWeekIndex];
      const isWorkingDay = workingDaysSet.has(dayOfWeekName);

      // Check OJT date boundaries
      const isBeforeOjt = ojtStartDate ? dateString < ojtStartDate : false;
      const isAfterOjt = ojtEndDate ? dateString > ojtEndDate : false;
      const isWithinOjtPeriod = !isBeforeOjt && !isAfterOjt;

      const attendanceRecord = recordMap.get(dateString) || null;

      // Determine Status
      let status: CalendarDayStatus = 'no_record';

      if (attendanceRecord) {
        if (attendanceRecord.status === 'working') {
          status = 'working';
        } else if (attendanceRecord.status === 'completed') {
          status = 'completed';
        } else if (attendanceRecord.status === 'late') {
          status = 'late';
        } else if (attendanceRecord.status === 'present') {
          status = 'present';
        } else if (attendanceRecord.status === 'absent') {
          status = 'absent';
        } else if (attendanceRecord.status === 'day_off') {
          status = 'day_off';
        }
      } else {
        // No record exists
        if (isBeforeOjt) {
          status = 'before_ojt';
        } else if (isAfterOjt) {
          status = 'after_ojt';
        } else if (!isWorkingDay) {
          status = 'day_off';
        } else {
          // Scheduled working day within OJT period
          if (dateString > todayStr) {
            status = 'upcoming';
          } else if (dateString < todayStr) {
            // Past working day with no attendance record
            status = 'absent';
          } else {
            // Today with no check-in yet
            status = 'upcoming';
          }
        }
      }

      // Generate Accessible Label
      const formattedDateForA11y = format(d, 'MMMM d, yyyy');
      let statusDescription = 'No record';
      switch (status) {
        case 'present':
        case 'completed':
          statusDescription = 'Completed attendance';
          break;
        case 'working':
          statusDescription = 'Currently working';
          break;
        case 'late':
          statusDescription = 'Late attendance';
          break;
        case 'absent':
          statusDescription = 'Absent';
          break;
        case 'day_off':
          statusDescription = 'Day off';
          break;
        case 'upcoming':
          statusDescription = 'Upcoming working day';
          break;
        case 'before_ojt':
          statusDescription = 'Before OJT period';
          break;
        case 'after_ojt':
          statusDescription = 'After OJT period';
          break;
      }

      const accessibleLabel = `${formattedDateForA11y}, ${statusDescription}${isToday ? ', Today' : ''}${isSelected ? ', Selected' : ''}`;

      return {
        dateString,
        dayNumber,
        date: d,
        isCurrentMonth,
        isToday,
        isSelected,
        isWorkingDay,
        isWithinOjtPeriod,
        status,
        attendanceRecord,
        dayOfWeekName,
        accessibleLabel,
      };
    });
  },

  /**
   * Calculates monthly summary statistics based on the month's days and attendance records.
   */
  calculateMonthlySummary(
    targetMonth: Date,
    days: CalendarDay[],
    attendanceRecords: AttendanceRecord[],
    ojtRecord: OjtRecord | null,
    totalCompletedMinutesOverall: number = 0
  ): MonthlyAttendanceSummary {
    const monthDays = days.filter((d) => isSameMonth(d.date, targetMonth));
    const today = new Date();
    const todayStr = getTodayDateString(today);

    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    let dayOffCount = 0;
    let totalScheduledWorkingDays = 0;

    monthDays.forEach((d) => {
      if (d.status === 'present' || d.status === 'completed' || d.status === 'working') {
        presentCount++;
      } else if (d.status === 'late') {
        lateCount++;
      } else if (d.status === 'absent') {
        absentCount++;
      } else if (d.status === 'day_off') {
        dayOffCount++;
      }

      // Count scheduled working days that fall within OJT period in this month
      if (d.isWorkingDay && d.isWithinOjtPeriod) {
        totalScheduledWorkingDays++;
      }
    });

    // Calculate total worked minutes in this month from actual attendance records
    let totalWorkedMinutes = 0;
    attendanceRecords.forEach((r) => {
      if (r.totalMinutes) {
        totalWorkedMinutes += r.totalMinutes;
      } else if (r.status === 'working' && r.checkIn) {
        totalWorkedMinutes += calculateElapsedMinutes(r.checkIn, new Date(), r.breakMinutes);
      }
    });

    // Attendance rate calculation
    // Total scheduled days in the past (or present) in this month that were expected
    const pastScheduledDaysCount = monthDays.filter(
      (d) =>
        d.isWorkingDay &&
        d.isWithinOjtPeriod &&
        (d.dateString < todayStr || d.attendanceRecord !== null)
    ).length;

    const attendedDaysCount = presentCount + lateCount;

    let attendanceRate: number | null = null;
    let attendanceRateFormatted = '--';

    if (pastScheduledDaysCount > 0) {
      attendanceRate = Math.min(
        100,
        Math.max(0, Math.round((attendedDaysCount / pastScheduledDaysCount) * 100))
      );
      attendanceRateFormatted = `${attendanceRate}%`;
    }

    const requiredOjtHours = ojtRecord?.requiredHours ?? 486;
    const completedOjtHours = Math.floor(totalCompletedMinutesOverall / 60);

    return {
      presentCount,
      lateCount,
      absentCount,
      dayOffCount,
      totalWorkedMinutes,
      totalWorkedHoursFormatted: formatHoursMinutes(totalWorkedMinutes),
      attendanceRate,
      attendanceRateFormatted,
      totalScheduledWorkingDays,
      completedOjtHours,
      requiredOjtHours,
    };
  },

  /**
   * Generates rich selected date details for the selected day card.
   */
  getSelectedDateDetails(day: CalendarDay, ojtRecord: OjtRecord | null): SelectedDateDetails {
    const today = new Date();
    const todayStr = getTodayDateString(today);
    const formattedDate = formatDateDisplay(day.date);
    const dayOfWeek = format(day.date, 'EEEE');

    const isPast = day.dateString < todayStr;
    const isFuture = day.dateString > todayStr;
    const isToday = day.dateString === todayStr;

    let statusDescription = '';
    let checkInFormatted: string | undefined;
    let checkOutFormatted: string | undefined;
    let expectedStartTime: string | undefined = ojtRecord?.expectedStartTime || '08:00 AM';
    let expectedEndTime: string | undefined = ojtRecord?.expectedEndTime || '05:00 PM';
    let totalHoursFormatted: string | undefined;
    let breakTimeFormatted: string | undefined;

    if (ojtRecord?.expectedStartTime) {
      expectedStartTime = formatTimeDisplay(`2000-01-01T${ojtRecord.expectedStartTime}:00`);
    }
    if (ojtRecord?.expectedEndTime) {
      expectedEndTime = formatTimeDisplay(`2000-01-01T${ojtRecord.expectedEndTime}:00`);
    }

    if (day.attendanceRecord) {
      const rec = day.attendanceRecord;
      checkInFormatted = formatTimeDisplay(rec.checkIn);
      checkOutFormatted = rec.checkOut ? formatTimeDisplay(rec.checkOut) : undefined;
      breakTimeFormatted = formatHoursMinutes(rec.breakMinutes);

      if (rec.totalMinutes) {
        totalHoursFormatted = formatHoursMinutes(rec.totalMinutes);
      } else if (rec.status === 'working') {
        const elapsed = calculateElapsedMinutes(rec.checkIn, new Date(), rec.breakMinutes);
        totalHoursFormatted = formatHoursMinutes(elapsed);
      } else {
        totalHoursFormatted = '0h 00m';
      }

      if (rec.status === 'completed') {
        statusDescription = 'Completed regular scheduled shift.';
      } else if (rec.status === 'working') {
        statusDescription = 'Shift currently in progress.';
      } else if (rec.status === 'late') {
        statusDescription = 'Checked in after expected start time.';
      } else if (rec.status === 'present') {
        statusDescription = 'Recorded present for this shift.';
      }
    } else {
      // Explanations for days without record
      switch (day.status) {
        case 'absent':
          statusDescription = 'No attendance record was recorded for this scheduled day.';
          break;
        case 'day_off':
          statusDescription = `${dayOfWeek} is not part of your regular OJT schedule.`;
          break;
        case 'upcoming':
          statusDescription = 'Your OJT schedule has no attendance record for this date yet.';
          break;
        case 'before_ojt':
          statusDescription = 'Your OJT had not started on this date.';
          break;
        case 'after_ojt':
          statusDescription = 'This date is after your expected OJT completion period.';
          break;
        default:
          statusDescription = 'No attendance recorded for this date.';
          break;
      }
    }

    return {
      dateString: day.dateString,
      formattedDate,
      dayOfWeek,
      status: day.status,
      isToday,
      isPast,
      isFuture,
      isWorkingDay: day.isWorkingDay,
      attendanceRecord: day.attendanceRecord,
      statusDescription,
      checkInFormatted,
      checkOutFormatted,
      expectedStartTime,
      expectedEndTime,
      totalHoursFormatted,
      breakTimeFormatted,
    };
  },
};

export default calendarService;
