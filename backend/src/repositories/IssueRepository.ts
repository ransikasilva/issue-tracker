import { BaseRepository } from './BaseRepository';
import { Issue } from '../models/Issue.model';
import { IIssue, IPaginationQuery, IPaginatedResponse, IssueStatus, IIssueStats } from '../types';
import { FilterQuery } from 'mongoose';

/**
 * Issue Repository
 */
// @ts-ignore - Mongoose Document type compatibility issue with TS6
export class IssueRepository extends BaseRepository<IIssue> {
  constructor() {
    super(Issue);
  }

  /**
   * Find issues with pagination, filtering, and search
   */
  async findWithPagination(query: IPaginationQuery): Promise<IPaginatedResponse<IIssue>> {
    const {
      page = 1,
      limit = 10,
      search,
      priority,
      status,
      severity,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const filter: FilterQuery<IIssue> = {};

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Severity filter
    if (severity) {
      filter.severity = severity;
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute queries in parallel for better performance
    const [data, totalItems] = await Promise.all([
      this.model.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec()
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get issue statistics
   */
  async getStats(): Promise<IIssueStats> {
    const [statusStats, priorityStats, severityStats, total] = await Promise.all([
      this.model.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      this.model.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      this.model.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      this.model.countDocuments()
    ]);

    // Initialize all status counts to 0
    const byStatus: Record<IssueStatus, number> = {
      [IssueStatus.OPEN]: 0,
      [IssueStatus.IN_PROGRESS]: 0,
      [IssueStatus.RESOLVED]: 0,
      [IssueStatus.CLOSED]: 0
    };

    // Fill in actual counts
    statusStats.forEach((stat) => {
      byStatus[stat._id as IssueStatus] = stat.count;
    });

    // Similar for priority and severity
    const byPriority: any = { low: 0, medium: 0, high: 0, critical: 0 };
    priorityStats.forEach((stat) => {
      byPriority[stat._id] = stat.count;
    });

    const bySeverity: any = { minor: 0, moderate: 0, major: 0, blocker: 0 };
    severityStats.forEach((stat) => {
      bySeverity[stat._id] = stat.count;
    });

    return {
      total,
      byStatus,
      byPriority,
      bySeverity
    };
  }

  /**
   * Find issues by user
   */
  async findByUser(userId: string): Promise<IIssue[]> {
    return await this.model.find({ createdBy: userId }).sort({ createdAt: -1 }).exec();
  }

  /**
   * Update issue status
   */
  async updateStatus(issueId: string, status: IssueStatus): Promise<IIssue | null> {
    return await this.updateById(issueId, { status });
  }
}
