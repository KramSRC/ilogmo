/**
 * Analytics Feature Domain Types
 */

export interface WeeklyHoursData {
  day: string; // e.g. "Mon", "Tue"
  date: string;
  hours: number;
  targetHours: number;
}

export interface ProgressAnalytics {
  totalLoggedHours: number;
  requiredTargetHours: number;
  percentageCompleted: number;
  estimatedCompletionDate?: string;
  weeklyTrend: WeeklyHoursData[];
  monthlyDistribution: { month: string; hours: number }[];
}
