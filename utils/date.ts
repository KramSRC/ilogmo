/**
 * iLogMo - Date Utility Helpers
 * Formatter and calculations built on top of date-fns.
 */

import { format, differenceInMinutes, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date, pattern: string = 'MMMM dd, yyyy'): string => {
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed) ? format(parsed, pattern) : '';
  } catch {
    return '';
  }
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'hh:mm a');
};

export const calculateDurationHours = (
  startTime: string | Date,
  endTime: string | Date
): number => {
  try {
    const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
    const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;
    if (!isValid(start) || !isValid(end)) return 0;
    const minutes = differenceInMinutes(end, start);
    return Math.max(0, Number((minutes / 60).toFixed(2)));
  } catch {
    return 0;
  }
};
