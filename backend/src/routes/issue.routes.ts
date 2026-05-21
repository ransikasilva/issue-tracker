import { Router } from 'express';
import { IssueController } from '../controllers/IssueController';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { Validators } from '../utils/validators';

/**
 * Issue Routes
 */
const router = Router();
const issueController = new IssueController();

// All routes require authentication
router.use(authMiddleware.authenticate);

// GET /api/issues/stats 
router.get('/stats', issueController.getStats);

// GET /api/issues/export
router.get('/export', issueController.exportIssues);

// CRUD routes
router.post(
  '/',
  ValidationMiddleware.validate(Validators.createIssueValidation),
  issueController.createIssue
);

router.get('/', issueController.getIssues);

router.get('/:id', issueController.getIssueById);

router.put(
  '/:id',
  ValidationMiddleware.validate(Validators.updateIssueValidation),
  issueController.updateIssue
);

router.delete('/:id', issueController.deleteIssue);

router.patch(
  '/:id/status',
  ValidationMiddleware.validate(Validators.updateStatusValidation),
  issueController.updateIssueStatus
);

export default router;
