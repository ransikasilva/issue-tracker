import { create } from 'zustand';
import type {
  Issue,
  IssueFilters,
  CreateIssueData,
  UpdateIssueData,
  IssueStats,
  PaginationInfo,
  IssueStatus
} from '../types';
import { IssueService } from '../services/issueService';

/**
 * Issue Store
 * Global state management for issues using Zustand
 */
interface IssueState {
  issues: Issue[];
  currentIssue: Issue | null;
  stats: IssueStats | null;
  filters: IssueFilters;
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchIssues: (page?: number, limit?: number) => Promise<void>;
  fetchIssueById: (id: string) => Promise<void>;
  createIssue: (data: CreateIssueData) => Promise<Issue>;
  updateIssue: (id: string, data: UpdateIssueData) => Promise<Issue>;
  deleteIssue: (id: string) => Promise<void>;
  updateIssueStatus: (id: string, status: IssueStatus) => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: Partial<IssueFilters>) => void;
  resetFilters: () => void;
  exportToJSON: () => Promise<void>;
  exportToCSV: () => Promise<void>;
}

const initialFilters: IssueFilters = {
  search: '',
  priority: '',
  status: '',
  severity: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  currentIssue: null,
  stats: null,
  filters: initialFilters,
  pagination: null,
  isLoading: false,
  error: null,

  /**
   * Fetch issues with pagination and filters
   */
  fetchIssues: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const filters = get().filters;
      const response = await IssueService.getIssues(page, limit, filters);
      set({
        issues: response.data || [],
        pagination: response.pagination || null,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch issues',
        isLoading: false
      });
    }
  },

  /**
   * Fetch issue by ID
   */
  fetchIssueById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const issue = await IssueService.getIssueById(id);
      set({
        currentIssue: issue,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch issue',
        isLoading: false
      });
    }
  },

  /**
   * Create a new issue
   */
  createIssue: async (data: CreateIssueData) => {
    set({ isLoading: true, error: null });
    try {
      const newIssue = await IssueService.createIssue(data);
      set({ isLoading: false });
      // Refresh issues list
      await get().fetchIssues();
      await get().fetchStats();
      return newIssue;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create issue',
        isLoading: false
      });
      throw error;
    }
  },

  /**
   * Update an issue
   */
  updateIssue: async (id: string, data: UpdateIssueData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedIssue = await IssueService.updateIssue(id, data);
      set({ isLoading: false });
      // Refresh issues list
      await get().fetchIssues();
      await get().fetchStats();
      return updatedIssue;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update issue',
        isLoading: false
      });
      throw error;
    }
  },

  /**
   * Delete an issue
   */
  deleteIssue: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await IssueService.deleteIssue(id);
      set({ isLoading: false });
      // Refresh issues list
      await get().fetchIssues();
      await get().fetchStats();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete issue',
        isLoading: false
      });
      throw error;
    }
  },

  /**
   * Update issue status
   */
  updateIssueStatus: async (id: string, status: IssueStatus) => {
    set({ isLoading: true, error: null });
    try {
      await IssueService.updateIssueStatus(id, status);
      set({ isLoading: false });
      // Refresh issues list
      await get().fetchIssues();
      await get().fetchStats();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update issue status',
        isLoading: false
      });
      throw error;
    }
  },

  /**
   * Fetch statistics
   */
  fetchStats: async () => {
    try {
      const stats = await IssueService.getStats();
      set({ stats });
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  },

  /**
   * Set filters
   */
  setFilters: (newFilters: Partial<IssueFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  /**
   * Reset filters
   */
  resetFilters: () => {
    set({ filters: initialFilters });
  },

  /**
   * Export to JSON
   */
  exportToJSON: async () => {
    try {
      const filters = get().filters;
      const issues = await IssueService.exportToJSON(filters);
      const blob = new Blob([JSON.stringify(issues, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `issues-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to export to JSON:', error);
      throw error;
    }
  },

  /**
   * Export to CSV
   */
  exportToCSV: async () => {
    try {
      const filters = get().filters;
      const blob = await IssueService.exportToCSV(filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `issues-${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to export to CSV:', error);
      throw error;
    }
  }
}));
