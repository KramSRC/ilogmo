/**
 * iLogMo - Profile Utilities
 * Helper functions for initials, name formatting, date formatting, and profile validations.
 */

import { format, parseISO, isValid } from 'date-fns';

/**
 * Returns uppercase initials from first and last name (e.g. "Juan Dela Cruz" -> "JD").
 */
export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const f = (firstName || '').trim();
  const l = (lastName || '').trim();

  if (f && l) {
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
  }
  if (f) {
    return f.substring(0, 2).toUpperCase();
  }
  if (l) {
    return l.substring(0, 2).toUpperCase();
  }
  return 'ST'; // Student Trainee default
}

/**
 * Formats full name cleanly.
 */
export function formatFullName(firstName?: string | null, lastName?: string | null): string {
  const full = `${firstName || ''} ${lastName || ''}`.trim();
  return full || 'Student Trainee';
}

/**
 * Formats account created date (e.g. "August 2026" or "August 28, 2026").
 */
export function formatAccountDate(dateStr?: string | null): string {
  if (!dateStr) return 'N/A';
  try {
    const parsed = parseISO(dateStr);
    if (isValid(parsed)) {
      return format(parsed, 'MMMM yyyy');
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Validates a contact number (optional or 7-15 digits with optional leading +).
 */
export function validateContactNumber(phone?: string | null): boolean {
  if (!phone || !phone.trim()) return true; // Optional
  const cleaned = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validates a username (3-30 characters, alphanumeric, underscores, dots).
 */
export function validateUsername(username?: string | null): { valid: boolean; error?: string } {
  if (!username || !username.trim()) return { valid: true }; // Optional
  const trimmed = username.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters.' };
  }
  if (trimmed.length > 30) {
    return { valid: false, error: 'Username cannot exceed 30 characters.' };
  }
  const usernameRegex = /^[a-zA-Z0-9._]+$/;
  if (!usernameRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, underscores, and dots.',
    };
  }
  return { valid: true };
}
