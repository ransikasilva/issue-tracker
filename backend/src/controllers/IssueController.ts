import { Request, Response, NextFunction } from 'express';
import { IssueService } from '../services/IssueService';
import { IPaginationQuery, IssueStatus } from '../types';

/**
 * Issue Controller
 */
export class IssueController {
  private issueService: IssueService;

  constructor() {
    this.issueService = new IssueService();
  }

  /**
   * Create a new issue
   * POST /api/issues
   */
  createIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const issueData = req.body;

      const issue = await this.issueService.createIssue(issueData, userId);

      res.status(201).json({
        success: true,
        message: 'Issue created successfully',
        data: issue
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all issues with pagination and filters
   * GET /api/issues
   */
  getIssues = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: IPaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        priority: req.query.priority as any,
        status: req.query.status as any,
        severity: req.query.severity as any,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await this.issueService.getIssues(query);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get issue by ID
   * GET /api/issues/:id
   */
  getIssueById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const issue = await this.issueService.getIssueById(id);

      res.status(200).json({
        success: true,
        data: issue
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update an issue
   * PUT /api/issues/:id
   */
  updateIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const updateData = req.body;

      const issue = await this.issueService.updateIssue(id, updateData, userId);

      res.status(200).json({
        success: true,
        message: 'Issue updated successfully',
        data: issue
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete an issue
   * DELETE /api/issues/:id
   */
  deleteIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      await this.issueService.deleteIssue(id, userId);

      res.status(200).json({
        success: true,
        message: 'Issue deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update issue status
   * PATCH /api/issues/:id/status
   */
  updateIssueStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = (req as any).user.id;

      const issue = await this.issueService.updateIssueStatus(id, status as IssueStatus, userId);

      res.status(200).json({
        success: true,
        message: 'Issue status updated successfully',
        data: issue
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get issue statistics
   * GET /api/issues/stats
   */
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.issueService.getIssueStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Export issues
   * GET /api/issues/export
   */
  exportIssues = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: IPaginationQuery = {
        search: req.query.search as string,
        priority: req.query.priority as any,
        status: req.query.status as any,
        severity: req.query.severity as any
      };

      const issues = await this.issueService.exportIssues(query);

      const format = req.query.format || 'json';

      if (format === 'csv') {
        // Convert to CSV
        const csv = this.convertToCSV(issues);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=issues.csv');
        res.status(200).send(csv);
      } else {
        // Return JSON
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=issues.json');
        res.status(200).json(issues);
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Helper method to convert issues to CSV
   */
  private convertToCSV(issues: any[]): string {
    if (issues.length === 0) return '';

    const headers = ['ID', 'Title', 'Description', 'Priority', 'Status', 'Severity', 'Created At'];
    const rows = issues.map(issue => [
      issue._id,
      `"${issue.title.replace(/"/g, '""')}"`,
      `"${issue.description.replace(/"/g, '""')}"`,
      issue.priority,
      issue.status,
      issue.severity,
      issue.createdAt
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}
