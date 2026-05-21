import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './Button';
import { Bug, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Navbar Component
 * Application navigation bar
 */
export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Bug size={18} className="text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Issue Tracker</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <User size={18} />
              <span>{user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
