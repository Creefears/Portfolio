import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  variant?: 'role' | 'tool';
  icon?: React.ReactNode;
}

export function Badge({ 
  children, 
  isSelected, 
  variant = 'role',
  icon,
  className,
  onClick,
  ...props 
}: BadgeProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button" // Explicitly set type to prevent form submission
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
        "flex items-center gap-2",
        variant === 'role' ? (
          isSelected
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        ) : (
          isSelected
            ? "bg-green-600 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        ),
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}