import { Document, Types } from 'mongoose';

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

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IIssue extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  severity: IssueSeverity;
  createdBy: string;
  assignedTo?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface IAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
  severity?: IssueSeverity;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface IIssueStats {
  total: number;
  byStatus: Record<IssueStatus, number>;
  byPriority: Record<IssuePriority, number>;
  bySeverity: Record<IssueSeverity, number>;
}
