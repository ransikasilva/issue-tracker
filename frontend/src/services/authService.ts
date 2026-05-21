import { apiClient } from './api';
import type { AuthResponse, User } from '../types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      name
    });
    return response.data;
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password
    });
    return response.data;
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  }

  /**
   * Save auth data to localStorage
   */
  static saveAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get saved auth data
   */
  static getAuthData(): { token: string | null; user: User | null } {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  }

  /**
   * Clear auth data
   */
  static clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
