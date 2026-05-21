import mongoose from 'mongoose';

/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose
 */
export class Database {
  /**
   * Connect to MongoDB
   */
  static async connect(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/issue-tracker';

      await mongoose.connect(mongoUri);

      console.log('✅ MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to application termination');
        process.exit(0);
      });
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  /**
   * Disconnect from MongoDB
   */
  static async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}
