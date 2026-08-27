/**
 * iLogMo - OJT Service
 * Handles Supabase database interactions for OJT setup and records.
 */

import { supabase } from '@/lib/supabase';
import { OjtRecord, OjtFormData, OjtActionResult } from '../types';

/**
 * Maps raw Supabase row to domain OjtRecord.
 */
function mapRowToOjtRecord(row: any): OjtRecord {
  return {
    id: row.id,
    userId: row.user_id,
    companyName: row.company_name,
    department: row.department,
    supervisorName: row.supervisor_name,
    companyAddress: row.company_address,
    requiredHours: row.required_hours,
    startDate: row.start_date,
    expectedEndDate: row.expected_end_date,
    workingDays: row.working_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    expectedStartTime: row.expected_start_time,
    expectedEndTime: row.expected_end_time,
    isActive: row.is_active ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const ojtService = {
  /**
   * Fetch active OJT configuration for the current user.
   */
  async getActiveOjt(userId: string): Promise<OjtRecord | null> {
    try {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('ojt_records')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.warn('[ojtService.getActiveOjt] Error:', error.message);
        return null;
      }

      return data ? mapRowToOjtRecord(data) : null;
    } catch (err) {
      console.warn('[ojtService.getActiveOjt] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Check if the student has completed OJT setup.
   */
  async hasCompletedOjtSetup(userId: string): Promise<boolean> {
    try {
      const active = await this.getActiveOjt(userId);
      return active !== null;
    } catch {
      return false;
    }
  },

  /**
   * Create an active OJT configuration record.
   */
  async createOjtRecord(
    userId: string,
    formData: OjtFormData
  ): Promise<OjtActionResult<OjtRecord>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const { data, error } = await supabase
        .from('ojt_records')
        .insert({
          user_id: userId,
          company_name: formData.companyName.trim(),
          department: formData.department.trim(),
          supervisor_name: formData.supervisorName?.trim() || null,
          company_address: formData.companyAddress?.trim() || null,
          required_hours: formData.requiredHours,
          start_date: formData.startDate,
          expected_end_date: formData.expectedEndDate || null,
          working_days: formData.workingDays,
          expected_start_time: formData.expectedStartTime || null,
          expected_end_time: formData.expectedEndTime || null,
          is_active: true,
        })
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to save OJT information. Please try again.',
        };
      }

      return {
        success: true,
        data: mapRowToOjtRecord(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to save your OJT setup. Please check your connection.',
      };
    }
  },

  /**
   * Update an existing OJT record.
   */
  async updateOjtRecord(
    userId: string,
    recordId: string,
    formData: Partial<OjtFormData>
  ): Promise<OjtActionResult<OjtRecord>> {
    try {
      if (!userId) {
        return { success: false, error: 'User is not authenticated.' };
      }

      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (formData.companyName !== undefined)
        updatePayload.company_name = formData.companyName.trim();
      if (formData.department !== undefined) updatePayload.department = formData.department.trim();
      if (formData.supervisorName !== undefined)
        updatePayload.supervisor_name = formData.supervisorName.trim() || null;
      if (formData.companyAddress !== undefined)
        updatePayload.company_address = formData.companyAddress.trim() || null;
      if (formData.requiredHours !== undefined)
        updatePayload.required_hours = formData.requiredHours;
      if (formData.startDate !== undefined) updatePayload.start_date = formData.startDate;
      if (formData.expectedEndDate !== undefined)
        updatePayload.expected_end_date = formData.expectedEndDate || null;
      if (formData.workingDays !== undefined) updatePayload.working_days = formData.workingDays;
      if (formData.expectedStartTime !== undefined)
        updatePayload.expected_start_time = formData.expectedStartTime || null;
      if (formData.expectedEndTime !== undefined)
        updatePayload.expected_end_time = formData.expectedEndTime || null;

      const { data, error } = await supabase
        .from('ojt_records')
        .update(updatePayload)
        .eq('id', recordId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to update OJT record.',
        };
      }

      return {
        success: true,
        data: mapRowToOjtRecord(data),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to update OJT record.',
      };
    }
  },
};

export default ojtService;
