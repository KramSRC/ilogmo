/**
 * iLogMo - Attendance Service
 * Handles Supabase database interactions, validations, and statistical aggregations for Attendance.
 */

import { supabase } from '@/lib/supabase';
import {
  AttendanceRecord,
  AttendanceActionResult,
  WeeklyAttendanceStats,
  MonthlyCalendarDay,
  CheckInPayload,
  CheckOutPayload,
} from '../types';
import {
  getTodayDateString,
  calculateElapsedMinutes,
  formatHoursMinutes,
  getCurrentWeekInterval,
  getMonthCalendarGrid,
} from '../utils/timeUtils';
import { isSameDay, isSameMonth } from 'date-fns';

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

export const attendanceService = {
  /**
   * Fetch today's attendance record for the current user.
   */
  async getTodayAttendance(userId: string): Promise<AttendanceRecord | null> {
    try {
      const today = getTodayDateString();
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('attendance_date', today)
        .maybeSingle();

      if (error) {
        console.warn('[attendanceService.getTodayAttendance] Error:', error.message);
        return null;
      }

      return data ? mapRowToAttendanceRecord(data) : null;
    } catch (err) {
      console.warn('[attendanceService.getTodayAttendance] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Check in for today.
   */
  async checkIn(
    userId: string,
    payload: CheckInPayload = {}
  ): Promise<AttendanceActionResult<AttendanceRecord>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const today = getTodayDateString();
      const existing = await this.getTodayAttendance(userId);

      if (existing) {
        return {
          success: false,
          error: 'You are already checked in for today.',
          data: existing,
        };
      }

      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          user_id: userId,
          attendance_date: today,
          check_in: nowIso,
          status: 'working',
          break_minutes: 0,
          notes: payload.notes || null,
          latitude: payload.latitude || null,
          longitude: payload.longitude || null,
          location_accuracy: payload.locationAccuracy || null,
        })
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to check in. Please try again.',
        };
      }

      return {
        success: true,
        data: mapRowToAttendanceRecord(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to check in. Please check your internet connection.',
      };
    }
  },

  /**
   * Check out for today.
   */
  async checkOut(
    userId: string,
    recordId: string,
    payload: CheckOutPayload = {}
  ): Promise<AttendanceActionResult<AttendanceRecord>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      // Fetch the active record
      const { data: currentRecord, error: fetchError } = await supabase
        .from('attendance')
        .select('*')
        .eq('id', recordId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !currentRecord) {
        return {
          success: false,
          error: 'You are not currently checked in.',
        };
      }

      if (currentRecord.check_out) {
        return {
          success: false,
          error: 'You have already checked out today.',
          data: mapRowToAttendanceRecord(currentRecord),
        };
      }

      const now = new Date();
      const nowIso = now.toISOString();
      const breakMinutes = payload.breakMinutes ?? currentRecord.break_minutes ?? 0;
      const totalMinutes = calculateElapsedMinutes(currentRecord.check_in, now, breakMinutes);

      const { data, error } = await supabase
        .from('attendance')
        .update({
          check_out: nowIso,
          total_minutes: totalMinutes,
          break_minutes: breakMinutes,
          status: 'completed',
          notes: payload.notes !== undefined ? payload.notes : currentRecord.notes,
          updated_at: nowIso,
        })
        .eq('id', recordId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to check out. Please try again.',
        };
      }

      return {
        success: true,
        data: mapRowToAttendanceRecord(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to check out. Please check your internet connection.',
      };
    }
  },

  /**
   * Fetch attendance history records ordered by date descending.
   */
  async getAttendanceHistory(userId: string, limit: number = 30): Promise<AttendanceRecord[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .order('attendance_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('[attendanceService.getAttendanceHistory] Error:', error.message);
        return [];
      }

      return (data || []).map(mapRowToAttendanceRecord);
    } catch (err) {
      console.warn('[attendanceService.getAttendanceHistory] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch a single attendance record by ID.
   */
  async getAttendanceById(userId: string, recordId: string): Promise<AttendanceRecord | null> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('id', recordId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;
      return mapRowToAttendanceRecord(data);
    } catch {
      return null;
    }
  },

  /**
   * Calculate weekly statistics for the current week (Monday to Sunday).
   */
  async getWeeklyOverview(userId: string): Promise<WeeklyAttendanceStats> {
    try {
      const { start, end } = getCurrentWeekInterval(new Date());
      const startDateStr = getTodayDateString(start);
      const endDateStr = getTodayDateString(end);

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .gte('attendance_date', startDateStr)
        .lte('attendance_date', endDateStr);

      if (error) {
        console.warn('[attendanceService.getWeeklyOverview] Error:', error.message);
        return {
          totalMinutes: 0,
          totalHoursFormatted: '0h 00m',
          daysPresent: 0,
          lateMinutes: 0,
          lateHoursFormatted: '0h 00m',
          attendanceRate: 0,
        };
      }

      const records = (data || []).map(mapRowToAttendanceRecord);

      let totalMinutes = 0;
      let lateMinutes = 0;
      const uniqueDays = new Set<string>();

      records.forEach((r) => {
        uniqueDays.add(r.attendanceDate);

        if (r.totalMinutes) {
          totalMinutes += r.totalMinutes;
        } else if (r.status === 'working' && r.checkIn) {
          // If currently working today, count live minutes so far
          totalMinutes += calculateElapsedMinutes(r.checkIn, new Date(), r.breakMinutes);
        }

        if (r.status === 'late') {
          lateMinutes += 15; // standard base offset for late status
        }
      });

      const daysPresent = uniqueDays.size;
      const scheduledWorkingDays = 5; // Standard 5-day OJT week
      const attendanceRate = Math.min(
        100,
        Math.max(0, Math.round((daysPresent / scheduledWorkingDays) * 100))
      );

      return {
        totalMinutes,
        totalHoursFormatted: formatHoursMinutes(totalMinutes),
        daysPresent,
        lateMinutes,
        lateHoursFormatted: formatHoursMinutes(lateMinutes),
        attendanceRate,
      };
    } catch (err) {
      console.warn('[attendanceService.getWeeklyOverview] Unexpected error:', err);
      return {
        totalMinutes: 0,
        totalHoursFormatted: '0h 00m',
        daysPresent: 0,
        lateMinutes: 0,
        lateHoursFormatted: '0h 00m',
        attendanceRate: 0,
      };
    }
  },

  /**
   * Generates calendar preview days for the monthly grid with matching attendance status.
   */
  async getMonthlyCalendarPreview(
    userId: string,
    targetMonth: Date = new Date()
  ): Promise<MonthlyCalendarDay[]> {
    try {
      const gridDays = getMonthCalendarGrid(targetMonth);
      const history = await this.getAttendanceHistory(userId, 60);
      const today = new Date();

      return gridDays.map((dateItem) => {
        const dateStr = getTodayDateString(dateItem);
        const match = history.find((h) => h.attendanceDate === dateStr);

        return {
          date: dateStr,
          dayNumber: dateItem.getDate(),
          isCurrentMonth: isSameMonth(dateItem, targetMonth),
          isToday: isSameDay(dateItem, today),
          status: match?.status,
          recordId: match?.id,
        };
      });
    } catch (err) {
      console.warn('[attendanceService.getMonthlyCalendarPreview] Unexpected error:', err);
      return [];
    }
  },
};

export default attendanceService;
