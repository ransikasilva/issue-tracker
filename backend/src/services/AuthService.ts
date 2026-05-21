import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../types';

/**
 * Authentication Service
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string): Promise<{ user: IUser; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmailPublic(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = await this.userRepository.create({
      email,
      password,
      name
    } as IUser);

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email);

    return { user, token };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    // Find user with password field
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject as IUser, token };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { id: string; email: string } {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
      };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return await this.userRepository.findById(userId);
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as string | number;

    return jwt.sign(
      { id: userId, email },
      secret,
      { expiresIn }
    );
  }
}
