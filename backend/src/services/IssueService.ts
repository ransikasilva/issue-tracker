import { IssueRepository } from '../repositories/IssueRepository';
import { IIssue, IPaginationQuery, IPaginatedResponse, IssueStatus, IIssueStats } from '../types';

/**
 * Issue Service
 */
export class IssueService {
  private issueRepository: IssueRepository;

  constructor() {
    this.issueRepository = new IssueRepository();
  }

  /**
   * Create a new issue
   */
  async createIssue(issueData: Partial<IIssue>, userId: string): Promise<IIssue> {
    // Validate required fields
    if (!issueData.title || !issueData.description) {
      throw new Error('Title and description are required');
    }

    // Set the creator
    const issue = await this.issueRepository.create({
      ...issueData,
      createdBy: userId,
      status: issueData.status || IssueStatus.OPEN
    } as IIssue);

    return issue;
  }

  /**
   * Get all issues with pagination and filters
   */
  async getIssues(query: IPaginationQuery): Promise<IPaginatedResponse<IIssue>> {
    return await this.issueRepository.findWithPagination(query);
  }

  /**
   * Get issue by ID
   */
  async getIssueById(issueId: string): Promise<IIssue> {
    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }
    return issue;
  }

  /**
   * Update an issue
   */
  async updateIssue(issueId: string, updateData: Partial<IIssue>, userId: string): Promise<IIssue> {
    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check if user is the creator (basic authorization)
    if (issue.createdBy !== userId) {
      throw new Error('You are not authorized to update this issue');
    }

    const updatedIssue = await this.issueRepository.updateById(issueId, updateData);
    if (!updatedIssue) {
      throw new Error('Failed to update issue');
    }

    return updatedIssue;
  }

  /**
   * Delete an issue
   */
  async deleteIssue(issueId: string, userId: string): Promise<void> {
    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check if user is the creator (basic authorization)
    if (issue.createdBy !== userId) {
      throw new Error('You are not authorized to delete this issue');
    }

    await this.issueRepository.deleteById(issueId);
  }

  /**
   * Update issue status (resolve, close, etc.)
   */
  async updateIssueStatus(
    issueId: string,
    status: IssueStatus,
    userId: string
  ): Promise<IIssue> {
    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check if user is the creator
    if (issue.createdBy !== userId) {
      throw new Error('You are not authorized to update this issue');
    }

    const updatedIssue = await this.issueRepository.updateStatus(issueId, status);
    if (!updatedIssue) {
      throw new Error('Failed to update issue status');
    }

    return updatedIssue;
  }

  /**
   * Get issue statistics
   */
  async getIssueStats(): Promise<IIssueStats> {
    return await this.issueRepository.getStats();
  }

  /**
   * Get user's issues
   */
  async getUserIssues(userId: string): Promise<IIssue[]> {
    return await this.issueRepository.findByUser(userId);
  }

  /**
   * Export issues to JSON
   */
  async exportIssues(query: IPaginationQuery): Promise<IIssue[]> {
    // Get all issues without pagination for export
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.severity) filter.severity = query.severity;

    return await this.issueRepository.find(filter);
  }
}
