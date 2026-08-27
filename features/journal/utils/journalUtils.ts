/**
 * iLogMo - Journal Date Utilities
 */

import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats a date string ('YYYY-MM-DD') into friendly display format (e.g. 'August 28, 2026').
 */
export function formatJournalDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      if (isValid(date)) {
        return format(date, 'MMMM d, yyyy');
      }
    }
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? format(parsed, 'MMMM d, yyyy') : dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Returns today's ISO date string 'YYYY-MM-DD' in local timezone.
 */
export function getTodayJournalDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
