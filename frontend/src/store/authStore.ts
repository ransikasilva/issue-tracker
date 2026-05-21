import { create } from 'zustand';
import type { User } from '../types';
import { AuthService } from '../services/authService';

/**
 * Authentication Store
 * Global state management for authentication using Zustand
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await AuthService.login(email, password);
      if (response.success && response.data) {
        const { user, token } = response.data;
        AuthService.saveAuthData(token, user);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Register user
   */
  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      const response = await AuthService.register(email, password, name);
      if (response.success && response.data) {
        const { user, token } = response.data;
        AuthService.saveAuthData(token, user);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    AuthService.clearAuthData();
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  /**
   * Initialize auth state from localStorage
   */
  initialize: () => {
    const { token, user } = AuthService.getAuthData();
    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true
      });
    }
  },

  /**
   * Set user
   */
  setUser: (user: User) => {
    set({ user });
  }
}));
