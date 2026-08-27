/**
 * iLogMo - Shared Global TypeScript Definitions
 */

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface NavigationRouteParams {
  id?: string;
  returnUrl?: string;
}
