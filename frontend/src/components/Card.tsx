import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

/**
 * Reusable Card Component
 * Container component for content sections
 */
export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200
        ${hoverable ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
