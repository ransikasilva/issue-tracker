import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Reusable Badge Component
 * Used for displaying status, priority, severity
 */
export const Badge: React.FC<BadgeProps> = ({ children, color, icon, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium
        ${color} ${className}
      `}
    >
      {icon}
      {children}
    </span>
  );
};
