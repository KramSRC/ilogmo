/**
 * iLogMo - Analytics Service
 * Handles calculation of overall OJT progress, attendance metrics, weekly distribution,
 * monthly breakdowns, and estimated completion forecasting from real attendance and OJT data.
 */

import { supabase } from '@/lib/supabase';
import { AttendanceRecord } from '@/features/attendance/types';
import { OjtRecord, WorkingDay } from '@/features/ojt/types';
import {
  AnalyticsData,
  OjtProgressStats,
  AttendanceOverviewStats,
  WeeklyAnalyticsStats,
  DailyWeeklyHours,
  MonthlyAnalyticsStats,
  MonthlyWeekStats,
  CompletionEstimate,
  AnalyticsInsight,
} from '../types';
import {
  formatHoursMinutes,
  getTodayDateString,
  formatDateDisplay,
  calculateElapsedMinutes,
} from '@/features/attendance/utils/timeUtils';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  format,
  addDays,
  parseISO,
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

const SHORT_DAY_NAMES: Record<number, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

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

export const analyticsService = {
  /**
   * Fetch all attendance records for the user.
   */
  async getAllAttendanceRecords(userId: string): Promise<AttendanceRecord[]> {
    try {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .order('attendance_date', { ascending: true });

      if (error) {
        console.warn('[analyticsService.getAllAttendanceRecords] Error:', error.message);
        return [];
      }

      return (data || []).map(mapRowToAttendanceRecord);
    } catch (err) {
      console.warn('[analyticsService.getAllAttendanceRecords] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Calculates overall OJT hours progress from real data.
   */
  calculateOverallProgress(
    records: AttendanceRecord[],
    ojtRecord: OjtRecord | null
  ): OjtProgressStats {
    const requiredHours = ojtRecord?.requiredHours ?? 486;
    const requiredMinutes = requiredHours * 60;

    let completedMinutes = 0;
    records.forEach((r) => {
      if (r.totalMinutes) {
        completedMinutes += r.totalMinutes;
      } else if (r.status === 'working' && r.checkIn) {
        completedMinutes += calculateElapsedMinutes(r.checkIn, new Date(), r.breakMinutes);
      }
    });

    const remainingMinutes = Math.max(0, requiredMinutes - completedMinutes);
    const rawPct = requiredMinutes > 0 ? (completedMinutes / requiredMinutes) * 100 : 0;
    const progressPercentage = Math.min(100, Math.max(0, Math.round(rawPct)));

    return {
      requiredHours,
      completedMinutes,
      completedHoursFormatted: formatHoursMinutes(completedMinutes),
      remainingMinutes,
      remainingHoursFormatted: formatHoursMinutes(remainingMinutes),
      progressPercentage,
    };
  },

  /**
   * Calculates high-level attendance overview statistics across the entire OJT timeline.
   */
  calculateAttendanceOverview(
    records: AttendanceRecord[],
    ojtRecord: OjtRecord | null
  ): AttendanceOverviewStats {
    const today = new Date();
    const todayStr = getTodayDateString(today);

    const workingDaysSet = new Set<WorkingDay>(
      ojtRecord?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    );

    const recordMap = new Map<string, AttendanceRecord>();
    records.forEach((r) => {
      recordMap.set(r.attendanceDate, r);
    });

    // Count present / late / working
    let presentDays = 0;
    let lateDays = 0;
    let absentDays = 0;
    let dayOffDays = 0;
    let scheduledPastDays = 0;
    let completedWorkedMinutes = 0;

    records.forEach((r) => {
      if (r.status === 'present' || r.status === 'completed' || r.status === 'working') {
        presentDays++;
      } else if (r.status === 'late') {
        lateDays++;
      } else if (r.status === 'absent') {
        absentDays++;
      } else if (r.status === 'day_off') {
        dayOffDays++;
      }

      if (r.totalMinutes) {
        completedWorkedMinutes += r.totalMinutes;
      } else if (r.status === 'working' && r.checkIn) {
        completedWorkedMinutes += calculateElapsedMinutes(r.checkIn, new Date(), r.breakMinutes);
      }
    });

    // If OJT has a start date, scan past days to accurately detect unlogged absent days & scheduled days
    if (ojtRecord?.startDate) {
      try {
        const start = parseISO(ojtRecord.startDate);
        const end = today;
        if (start <= end) {
          const days = eachDayOfInterval({ start, end });
          days.forEach((d) => {
            const dateStr = format(d, 'yyyy-MM-dd');
            const dayOfWeek = DAY_NAME_MAP[d.getDay()];
            const isScheduledWorkingDay = workingDaysSet.has(dayOfWeek);

            // Don't double count if date is after expected end date
            if (ojtRecord.expectedEndDate && dateStr > ojtRecord.expectedEndDate) {
              return;
            }

            if (isScheduledWorkingDay) {
              scheduledPastDays++;
              const hasRecord = recordMap.has(dateStr);
              if (!hasRecord && dateStr < todayStr) {
                // Past working day without attendance is considered absent
                absentDays++;
              }
            } else {
              dayOffDays++;
            }
          });
        }
      } catch (err) {
        console.warn('[calculateAttendanceOverview] Interval error:', err);
      }
    }

    const totalAttendedDays = presentDays + lateDays;

    let attendanceRate: number | null = null;
    let attendanceRateFormatted = '--';

    const baselineScheduled = Math.max(scheduledPastDays, totalAttendedDays + absentDays);
    if (baselineScheduled > 0) {
      attendanceRate = Math.min(
        100,
        Math.max(0, Math.round((totalAttendedDays / baselineScheduled) * 100))
      );
      attendanceRateFormatted = `${attendanceRate}%`;
    }

    const averageMinutesPerDay =
      totalAttendedDays > 0 ? Math.round(completedWorkedMinutes / totalAttendedDays) : 0;
    const averageHoursFormatted =
      totalAttendedDays > 0 ? formatHoursMinutes(averageMinutesPerDay) : '--';

    return {
      presentDays,
      lateDays,
      absentDays,
      dayOffDays,
      totalAttendedDays,
      attendanceRate,
      attendanceRateFormatted,
      averageMinutesPerDay,
      averageHoursFormatted,
    };
  },

  /**
   * Calculates this week's daily distribution (Monday - Sunday).
   */
  calculateWeeklyStats(
    records: AttendanceRecord[],
    ojtRecord: OjtRecord | null
  ): WeeklyAnalyticsStats {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const workingDaysSet = new Set<WorkingDay>(
      ojtRecord?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    );

    const recordMap = new Map<string, AttendanceRecord>();
    records.forEach((r) => {
      recordMap.set(r.attendanceDate, r);
    });

    let totalWeekMinutes = 0;
    const rawDays: {
      dayLabel: string;
      dateString: string;
      minutes: number;
      isToday: boolean;
      isWorkingDay: boolean;
    }[] = [];

    weekDays.forEach((d) => {
      const dateString = format(d, 'yyyy-MM-dd');
      const dayOfWeekName = DAY_NAME_MAP[d.getDay()];
      const isWorkingDay = workingDaysSet.has(dayOfWeekName);
      const isToday = isSameDay(d, today);
      const dayLabel = SHORT_DAY_NAMES[d.getDay()];

      const rec = recordMap.get(dateString);
      let dayMinutes = 0;

      if (rec) {
        if (rec.totalMinutes) {
          dayMinutes = rec.totalMinutes;
        } else if (rec.status === 'working' && rec.checkIn) {
          dayMinutes = calculateElapsedMinutes(rec.checkIn, new Date(), rec.breakMinutes);
        }
      }

      totalWeekMinutes += dayMinutes;

      rawDays.push({
        dayLabel,
        dateString,
        minutes: dayMinutes,
        isToday,
        isWorkingDay,
      });
    });

    // Find maximum minutes for proportional bar chart (baseline 8 hours = 480 mins)
    const maxDayMinutes = Math.max(480, ...rawDays.map((d) => d.minutes));

    const days: DailyWeeklyHours[] = rawDays.map((d) => ({
      ...d,
      hoursFormatted: d.minutes > 0 ? formatHoursMinutes(d.minutes) : '0h',
      percentageOfMax: Math.min(100, Math.max(0, Math.round((d.minutes / maxDayMinutes) * 100))),
    }));

    return {
      startDate: format(weekStart, 'yyyy-MM-dd'),
      endDate: format(weekEnd, 'yyyy-MM-dd'),
      totalMinutes: totalWeekMinutes,
      totalHoursFormatted: formatHoursMinutes(totalWeekMinutes),
      days,
    };
  },

  /**
   * Calculates monthly stats and weekly breakdown chart for a selected month.
   */
  calculateMonthlyStats(
    records: AttendanceRecord[],
    targetMonth: Date,
    ojtRecord: OjtRecord | null
  ): MonthlyAnalyticsStats {
    const monthStart = startOfMonth(targetMonth);
    const monthEnd = endOfMonth(targetMonth);
    const monthFormatted = format(targetMonth, 'MMMM yyyy');
    const today = new Date();
    const todayStr = getTodayDateString(today);

    const workingDaysSet = new Set<WorkingDay>(
      ojtRecord?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    );

    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const recordMap = new Map<string, AttendanceRecord>();
    records.forEach((r) => {
      recordMap.set(r.attendanceDate, r);
    });

    let monthTotalMinutes = 0;
    let presentDays = 0;
    let lateDays = 0;
    let absentDays = 0;
    let dayOffDays = 0;
    let scheduledPastDays = 0;

    monthDays.forEach((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayOfWeek = DAY_NAME_MAP[d.getDay()];
      const isWorkingDay = workingDaysSet.has(dayOfWeek);

      const isWithinOjt =
        (!ojtRecord?.startDate || dateStr >= ojtRecord.startDate) &&
        (!ojtRecord?.expectedEndDate || dateStr <= ojtRecord.expectedEndDate);

      const rec = recordMap.get(dateStr);

      if (rec) {
        if (rec.totalMinutes) {
          monthTotalMinutes += rec.totalMinutes;
        } else if (rec.status === 'working' && rec.checkIn) {
          monthTotalMinutes += calculateElapsedMinutes(rec.checkIn, new Date(), rec.breakMinutes);
        }

        if (rec.status === 'present' || rec.status === 'completed' || rec.status === 'working') {
          presentDays++;
        } else if (rec.status === 'late') {
          lateDays++;
        } else if (rec.status === 'absent') {
          absentDays++;
        } else if (rec.status === 'day_off') {
          dayOffDays++;
        }
      } else {
        if (isWorkingDay && isWithinOjt) {
          if (dateStr < todayStr) {
            absentDays++;
          }
        } else {
          dayOffDays++;
        }
      }

      if (isWorkingDay && isWithinOjt && dateStr <= todayStr) {
        scheduledPastDays++;
      }
    });

    const attendedDays = presentDays + lateDays;
    let attendanceRate: number | null = null;
    let attendanceRateFormatted = '--';

    if (scheduledPastDays > 0) {
      attendanceRate = Math.min(
        100,
        Math.max(0, Math.round((attendedDays / scheduledPastDays) * 100))
      );
      attendanceRateFormatted = `${attendanceRate}%`;
    }

    // Split month into 7-day week chunks for the monthly bar chart
    const weeks: { weekLabel: string; startDate: string; endDate: string; totalMinutes: number }[] =
      [];
    let currentWeekMinutes = 0;
    let weekIndex = 1;
    let currentWeekStart = monthDays[0];

    monthDays.forEach((d, index) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const rec = recordMap.get(dateStr);
      if (rec) {
        if (rec.totalMinutes) {
          currentWeekMinutes += rec.totalMinutes;
        } else if (rec.status === 'working' && rec.checkIn) {
          currentWeekMinutes += calculateElapsedMinutes(rec.checkIn, new Date(), rec.breakMinutes);
        }
      }

      const isSunday = d.getDay() === 0;
      const isLastDay = index === monthDays.length - 1;

      if (isSunday || isLastDay) {
        weeks.push({
          weekLabel: `Week ${weekIndex}`,
          startDate: format(currentWeekStart, 'yyyy-MM-dd'),
          endDate: dateStr,
          totalMinutes: currentWeekMinutes,
        });
        weekIndex++;
        currentWeekMinutes = 0;
        if (index < monthDays.length - 1) {
          currentWeekStart = monthDays[index + 1];
        }
      }
    });

    const maxWeekMinutes = Math.max(2400, ...weeks.map((w) => w.totalMinutes)); // Baseline 40h = 2400m
    const formattedWeeks: MonthlyWeekStats[] = weeks.map((w) => ({
      ...w,
      totalHoursFormatted: formatHoursMinutes(w.totalMinutes),
      percentageOfMax: Math.min(
        100,
        Math.max(0, Math.round((w.totalMinutes / maxWeekMinutes) * 100))
      ),
    }));

    return {
      monthDate: targetMonth,
      monthFormatted,
      totalMinutes: monthTotalMinutes,
      totalHoursFormatted: formatHoursMinutes(monthTotalMinutes),
      presentDays,
      lateDays,
      absentDays,
      dayOffDays,
      attendanceRate,
      attendanceRateFormatted,
      weeks: formattedWeeks,
    };
  },

  /**
   * Forecasts estimated completion date based on real average working pace and working schedule.
   */
  calculateCompletionEstimate(
    overview: AttendanceOverviewStats,
    progress: OjtProgressStats,
    ojtRecord: OjtRecord | null
  ): CompletionEstimate {
    const remainingMinutes = progress.remainingMinutes;

    if (remainingMinutes <= 0) {
      return {
        hasSufficientData: true,
        estimatedCompletionDate: 'Completed',
        estimatedDaysRemaining: 0,
        message: 'Congratulations! You have fulfilled all required OJT hours.',
      };
    }

    // Need at least 3 completed attendance days to make an accurate prediction
    if (overview.totalAttendedDays < 3 || overview.averageMinutesPerDay <= 0) {
      return {
        hasSufficientData: false,
        message: 'Keep logging your attendance to see your estimated completion date.',
        expectedEndDate: ojtRecord?.expectedEndDate
          ? formatDateDisplay(ojtRecord.expectedEndDate)
          : undefined,
      };
    }

    const workingDaysSet = new Set<WorkingDay>(
      ojtRecord?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    );

    const neededDays = Math.ceil(remainingMinutes / overview.averageMinutesPerDay);

    // Project forward from tomorrow through scheduled working days
    let cursor = new Date();
    let remainingToProject = neededDays;
    let safetyCounter = 0;

    while (remainingToProject > 0 && safetyCounter < 1000) {
      cursor = addDays(cursor, 1);
      safetyCounter++;
      const dayOfWeek = DAY_NAME_MAP[cursor.getDay()];
      if (workingDaysSet.has(dayOfWeek)) {
        remainingToProject--;
      }
    }

    const estimatedDateStr = format(cursor, 'yyyy-MM-dd');
    const estimatedFormatted = formatDateDisplay(cursor);
    const expectedEndDateStr = ojtRecord?.expectedEndDate || null;

    let isOverdueWarning = false;
    let message = `At your current average, you may complete your OJT around ${estimatedFormatted}.`;

    if (expectedEndDateStr) {
      if (estimatedDateStr > expectedEndDateStr) {
        isOverdueWarning = true;
        const expectedFormatted = formatDateDisplay(expectedEndDateStr);
        message = `Estimated completion: ${estimatedFormatted}. (Your expected OJT end date is ${expectedFormatted}).`;
      } else {
        message = `You are on track to complete your required hours around ${estimatedFormatted}.`;
      }
    }

    return {
      hasSufficientData: true,
      estimatedCompletionDate: estimatedFormatted,
      estimatedDaysRemaining: neededDays,
      message,
      isOverdueWarning,
      expectedEndDate: expectedEndDateStr ? formatDateDisplay(expectedEndDateStr) : undefined,
    };
  },

  /**
   * Generates actionable, real-data-backed analytical insights.
   */
  generateInsights(
    progress: OjtProgressStats,
    overview: AttendanceOverviewStats,
    monthly: MonthlyAnalyticsStats,
    estimate: CompletionEstimate
  ): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // 1. Pace / Average hours insight
    if (overview.averageMinutesPerDay > 0) {
      const avgHoursDec = (overview.averageMinutesPerDay / 60).toFixed(1);
      insights.push({
        id: 'insight-avg-hours',
        type: 'pace',
        icon: 'clock',
        message: `You're averaging ${avgHoursDec} hours per attended working day.`,
      });
    }

    // 2. Progress percentage milestone
    if (progress.progressPercentage > 0) {
      insights.push({
        id: 'insight-progress-pct',
        type: 'progress',
        icon: 'trending',
        message: `You have completed ${progress.progressPercentage}% of your required ${progress.requiredHours} OJT hours.`,
      });
    }

    // 3. Monthly Attendance Rate
    if (monthly.attendanceRate !== null) {
      insights.push({
        id: 'insight-monthly-rate',
        type: 'attendance',
        icon: 'check',
        message: `Your attendance rate for ${monthly.monthFormatted} is ${monthly.attendanceRateFormatted}.`,
      });
    }

    // 4. Forecast status
    if (estimate.hasSufficientData) {
      insights.push({
        id: 'insight-forecast',
        type: 'milestone',
        icon: 'calendar',
        message: estimate.isOverdueWarning
          ? 'Log additional hours where possible to finish before your expected end date.'
          : 'You are currently on track to finish your required OJT hours.',
      });
    }

    return insights;
  },

  /**
   * Main aggregator: Fetches and calculates all analytics for the given month.
   */
  async getAnalyticsData(
    userId: string,
    targetMonth: Date,
    ojtRecord: OjtRecord | null
  ): Promise<AnalyticsData> {
    const records = await this.getAllAttendanceRecords(userId);

    const overall = this.calculateOverallProgress(records, ojtRecord);
    const attendanceOverview = this.calculateAttendanceOverview(records, ojtRecord);
    const thisWeek = this.calculateWeeklyStats(records, ojtRecord);
    const monthly = this.calculateMonthlyStats(records, targetMonth, ojtRecord);
    const estimate = this.calculateCompletionEstimate(attendanceOverview, overall, ojtRecord);
    const insights = this.generateInsights(overall, attendanceOverview, monthly, estimate);

    return {
      overall,
      attendanceOverview,
      thisWeek,
      monthly,
      estimate,
      insights,
    };
  },
};

export default analyticsService;
