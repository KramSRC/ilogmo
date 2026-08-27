/**
 * iLogMo - OJT Setup Form Validation Schemas
 * Built with Zod for strict type checking and friendly error messages.
 */

import { z } from 'zod';
import { WorkingDay } from './types';

const WORKING_DAYS: [WorkingDay, ...WorkingDay[]] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ojtSetupSchema = z
  .object({
    requiredHours: z.coerce
      .number({ invalid_type_error: 'Please enter a valid number of hours' })
      .int('Required hours must be a whole number')
      .positive('Required hours must be greater than 0')
      .max(10000, 'Required hours cannot exceed 10,000 hours'),
    startDate: z.string().min(1, 'OJT start date is required'),
    expectedEndDate: z.string().optional().or(z.literal('')),
    companyName: z.string().trim().min(2, 'Company name must be at least 2 characters'),
    department: z.string().trim().min(2, 'Department must be at least 2 characters'),
    supervisorName: z.string().trim().optional().or(z.literal('')),
    companyAddress: z.string().trim().optional().or(z.literal('')),
    workingDays: z.array(z.enum(WORKING_DAYS)).min(1, 'Please select at least one working day'),
    expectedStartTime: z.string().optional().or(z.literal('')),
    expectedEndTime: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.startDate && data.expectedEndDate && data.expectedEndDate.trim() !== '') {
        return new Date(data.expectedEndDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'Expected end date cannot be earlier than start date',
      path: ['expectedEndDate'],
    }
  );

export type OjtSetupFormData = z.infer<typeof ojtSetupSchema>;
