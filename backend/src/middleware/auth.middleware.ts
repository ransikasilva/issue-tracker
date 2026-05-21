import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

/**
 * Authentication Middleware
 */
export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Verify JWT token from Authorization header
   */
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: 'No token provided'
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify token
      const decoded = this.authService.verifyToken(token);

      // Attach user to request
      (req as any).user = decoded;

      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message || 'Invalid token'
      });
    }
  };
}

// Export singleton instance
export const authMiddleware = new AuthMiddleware();
