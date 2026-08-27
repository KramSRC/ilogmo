/**
 * Journal Feature Domain Types
 */

export interface JournalEntry {
  id: string;
  userId: string;
  attendanceId?: string | null;
  date: string; // ISO date YYYY-MM-DD
  title: string;
  content: string;
  activitiesLearned?: string[];
  challengesFaced?: string[];
  moodRating?: number; // 1 to 5
  supervisorRemarks?: string | null;
  attachmentUrls?: string[];
  createdAt: string;
  updatedAt: string;
}
