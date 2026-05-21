import { BaseRepository } from './BaseRepository';
import { User } from '../models/User.model';
import { IUser } from '../types';

/**
 * User Repository
 */
// @ts-ignore - Mongoose Document type compatibility issue with TS6
export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).select('+password').exec();
  }

  /**
   * Find user by email without password
   */
  async findByEmailPublic(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).exec();
  }

  /**
   * Check if email already exists
   */
  async emailExists(email: string): Promise<boolean> {
    return await this.exists({ email });
  }

  /**
   * Get all users (excluding passwords)
   */
  async getAllUsers(): Promise<IUser[]> {
    return await this.model.find().select('-password').exec();
  }
}
