import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { EnvConfig } from './config/env';
import { Database } from './config/database';
import { ErrorHandler } from './middleware/errorHandler.middleware';
import authRoutes from './routes/auth.routes';
import issueRoutes from './routes/issue.routes';

/**
 * Main Application Server
 */
class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5000');
    this.initializeConfig();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize configuration
   */
  private initializeConfig(): void {
    EnvConfig.load();
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true
      })
    );

    // Compression middleware
    this.app.use(compression());

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware (simple)
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/issues', issueRoutes);

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    });
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    this.app.use(ErrorHandler.handle);
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    try {
      // Connect to database
      await Database.connect();

      // Start listening (only in non-serverless environment)
      if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        this.app.listen(this.port, () => {
          console.log(`\n🚀 Server running on port ${this.port}`);
          console.log(`📍 Environment: ${process.env.NODE_ENV}`);
          console.log(`🔗 API: http://localhost:${this.port}/api`);
          console.log(`💚 Health check: http://localhost:${this.port}/health\n`);
        });
      }
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  getApp(): Application {
    return this.app;
  }
}

// Initialize server
const server = new Server();
server.start();

// Export for Vercel
export default server.getApp();
