/**
 * iLogMo - Attendance Time Utilities
 * High precision calculations and formatters using date-fns.
 */

import {
  format,
  differenceInMinutes,
  parseISO,
  isValid,
  isWeekend,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

/**
 * Formats total minutes into readable "0h 00m" / "8h 57m" format.
 * Never outputs floating-point representations.
 */
export function formatHoursMinutes(totalMinutes: number = 0): string {
  const safeMinutes = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  return `${hours}h ${paddedMinutes}m`;
}

/**
 * Calculates elapsed worked minutes between check-in and check-out (or now), subtracting breaks.
 */
export function calculateElapsedMinutes(
  checkIn: string | Date,
  checkOut?: string | Date | null,
  breakMinutes: number = 0
): number {
  try {
    const startDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
    const endDate = checkOut
      ? typeof checkOut === 'string'
        ? parseISO(checkOut)
        : checkOut
      : new Date();

    if (!isValid(startDate) || !isValid(endDate)) return 0;

    const diff = differenceInMinutes(endDate, startDate);
    const effective = Math.max(0, diff - Math.max(0, breakMinutes));
    return effective;
  } catch {
    return 0;
  }
}

/**
 * Formats time to 12-hour AM/PM format (e.g. "8:01 AM").
 */
export function formatTimeDisplay(date: string | Date | null | undefined): string {
  if (!date) return '--:--';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed) ? format(parsed, 'h:mm a') : '--:--';
  } catch {
    return '--:--';
  }
}

/**
 * Formats date to human-readable full date (e.g. "May 8, 2025").
 */
export function formatDateDisplay(date: string | Date | null | undefined): string {
  if (!date) return '';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed) ? format(parsed, 'MMMM d, yyyy') : '';
  } catch {
    return '';
  }
}

/**
 * Formats date components for history list rows (e.g. { dayName: 'THU', dayNumber: '08', monthName: 'May' }).
 */
export function formatDateShort(date: string | Date): {
  dayName: string;
  dayNumber: string;
  monthName: string;
} {
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsed)) {
      return { dayName: '---', dayNumber: '--', monthName: '---' };
    }
    return {
      dayName: format(parsed, 'EEE').toUpperCase(),
      dayNumber: format(parsed, 'dd'),
      monthName: format(parsed, 'MMM'),
    };
  } catch {
    return { dayName: '---', dayNumber: '--', monthName: '---' };
  }
}

/**
 * Returns current date string formatted as "YYYY-MM-DD".
 */
export function getTodayDateString(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Checks if a given date falls on a weekend (Saturday or Sunday).
 */
export function isWeekendDay(date: Date = new Date()): boolean {
  return isWeekend(date);
}

/**
 * Generates the week interval for the current week (Monday to Sunday).
 */
export function getCurrentWeekInterval(currentDate: Date = new Date()) {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });
  return { start, end };
}

/**
 * Generates all calendar days for a monthly preview grid (including padding days).
 */
export function getMonthCalendarGrid(targetDate: Date = new Date()): Date[] {
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}
