import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { Validators } from '../utils/validators';

/**
 * Authentication Routes
 */
const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  '/register',
  ValidationMiddleware.validate(Validators.registerValidation),
  authController.register
);

router.post(
  '/login',
  ValidationMiddleware.validate(Validators.loginValidation),
  authController.login
);

// Protected routes
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);

export default router;
