import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "w-full rounded-lg border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
            "focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent",
            "transition-colors duration-200",
            "text-center",
            icon && "pl-10",
            error && "border-red-500 dark:border-red-400",
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}