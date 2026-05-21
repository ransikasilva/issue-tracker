import mongoose from 'mongoose';

/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose
 */
export class Database {
  private static isConnected = false;

  /**
   * Connect to MongoDB
   */
  static async connect(): Promise<void> {
    // Reuse existing connection in serverless
    if (this.isConnected && mongoose.connection.readyState === 1) {
      console.log('✅ Using existing MongoDB connection');
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/issue-tracker';

      await mongoose.connect(mongoUri, {
        bufferCommands: false,
      });

      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
        this.isConnected = false;
      });

      // Graceful shutdown (not needed in serverless)
      if (!process.env.VERCEL) {
        process.on('SIGINT', async () => {
          await mongoose.connection.close();
          console.log('MongoDB connection closed due to application termination');
          process.exit(0);
        });
      }
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  static async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}
