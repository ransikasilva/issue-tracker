import { body } from 'express-validator';

/**
 * Validation Rules
 */
export class Validators {
  /**
   * User registration validation
   */
  static registerValidation = [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long')
  ];

  /**
   * User login validation
   */
  static loginValidation = [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ];

  /**
   * Create issue validation
   */
  static createIssueValidation = [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Invalid priority value'),
    body('severity')
      .optional()
      .isIn(['minor', 'moderate', 'major', 'blocker'])
      .withMessage('Invalid severity value'),
    body('status')
      .optional()
      .isIn(['open', 'in_progress', 'resolved', 'closed'])
      .withMessage('Invalid status value')
  ];

  /**
   * Update issue validation
   */
  static updateIssueValidation = [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Invalid priority value'),
    body('severity')
      .optional()
      .isIn(['minor', 'moderate', 'major', 'blocker'])
      .withMessage('Invalid severity value'),
    body('status')
      .optional()
      .isIn(['open', 'in_progress', 'resolved', 'closed'])
      .withMessage('Invalid status value')
  ];

  /**
   * Update status validation
   */
  static updateStatusValidation = [
    body('status')
      .isIn(['open', 'in_progress', 'resolved', 'closed'])
      .withMessage('Invalid status value')
  ];
}
