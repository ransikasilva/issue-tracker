export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum IssueSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  BLOCKER = 'blocker'
}

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  severity: IssueSeverity;
  createdBy: string;
  assignedTo?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IssueFilters {
  search?: string;
  priority?: IssuePriority | '';
  status?: IssueStatus | '';
  severity?: IssueSeverity | '';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IssueStats {
  total: number;
  byStatus: Record<IssueStatus, number>;
  byPriority: Record<IssuePriority, number>;
  bySeverity: Record<IssueSeverity, number>;
}

export interface CreateIssueData {
  title: string;
  description: string;
  priority: IssuePriority;
  severity: IssueSeverity;
  tags?: string[];
}

export interface UpdateIssueData {
  title?: string;
  description?: string;
  priority?: IssuePriority;
  severity?: IssueSeverity;
  status?: IssueStatus;
  tags?: string[];
}
