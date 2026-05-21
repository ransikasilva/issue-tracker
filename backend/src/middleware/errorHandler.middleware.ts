import { Request, Response, NextFunction } from 'express';

/**
 * Error Handler Middleware
 */
export class ErrorHandler {
  static handle(err: any, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: Object.values(err.errors).map((e: any) => e.message)
      });
      return;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      res.status(400).json({
        success: false,
        error: 'Duplicate field value entered'
      });
      return;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
      return;
    }

    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'Token expired'
      });
      return;
    }

    // Default error
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
}
