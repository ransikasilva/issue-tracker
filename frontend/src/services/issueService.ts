import { apiClient } from './api';
import type {
  Issue,
  CreateIssueData,
  UpdateIssueData,
  IssueFilters,
  IssueStats,
  ApiResponse,
  IssueStatus
} from '../types';

/**
 * Issue Service
 * Handles all issue-related API calls
 */
export class IssueService {
  /**
   * Get all issues with filters and pagination
   */
  static async getIssues(
    page: number = 1,
    limit: number = 10,
    filters?: IssueFilters
  ): Promise<ApiResponse<Issue[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }

    const response = await apiClient.get<ApiResponse<Issue[]>>(`/issues?${params.toString()}`);
    return response.data;
  }

  /**
   * Get issue by ID
   */
  static async getIssueById(id: string): Promise<Issue> {
    const response = await apiClient.get<ApiResponse<Issue>>(`/issues/${id}`);
    return response.data.data!;
  }

  /**
   * Create a new issue
   */
  static async createIssue(data: CreateIssueData): Promise<Issue> {
    const response = await apiClient.post<ApiResponse<Issue>>('/issues', data);
    return response.data.data!;
  }

  /**
   * Update an issue
   */
  static async updateIssue(id: string, data: UpdateIssueData): Promise<Issue> {
    const response = await apiClient.put<ApiResponse<Issue>>(`/issues/${id}`, data);
    return response.data.data!;
  }

  /**
   * Delete an issue
   */
  static async deleteIssue(id: string): Promise<void> {
    await apiClient.delete(`/issues/${id}`);
  }

  /**
   * Update issue status
   */
  static async updateIssueStatus(id: string, status: IssueStatus): Promise<Issue> {
    const response = await apiClient.patch<ApiResponse<Issue>>(`/issues/${id}/status`, {
      status
    });
    return response.data.data!;
  }

  /**
   * Get issue statistics
   */
  static async getStats(): Promise<IssueStats> {
    const response = await apiClient.get<ApiResponse<IssueStats>>('/issues/stats');
    return response.data.data!;
  }

  /**
   * Export issues to JSON
   */
  static async exportToJSON(filters?: IssueFilters): Promise<Issue[]> {
    const params = new URLSearchParams({ format: 'json' });

    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);
      if (filters.severity) params.append('severity', filters.severity);
    }

    const response = await apiClient.get<Issue[]>(`/issues/export?${params.toString()}`);
    return response.data;
  }

  /**
   * Export issues to CSV
   */
  static async exportToCSV(filters?: IssueFilters): Promise<Blob> {
    const params = new URLSearchParams({ format: 'csv' });

    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);
      if (filters.severity) params.append('severity', filters.severity);
    }

    const response = await apiClient.get(`/issues/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}
