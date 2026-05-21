import dotenv from 'dotenv';

/**
 * Environment Configuration
 * Loads and validates environment variables
 */
export class EnvConfig {
  static load(): void {
    dotenv.config();

    // Validate required environment variables
    const requiredEnvVars = ['JWT_SECRET'];

    const missing = requiredEnvVars.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.warn(`⚠️  Warning: Missing environment variables: ${missing.join(', ')}`);
      console.warn('Using default values for development. Update .env file for production.');
    }

    // Set defaults for development
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'dev-secret-key-change-in-production';
    }

    if (!process.env.PORT) {
      process.env.PORT = '5000';
    }

    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'development';
    }
  }
}
