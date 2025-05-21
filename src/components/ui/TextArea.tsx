import React from 'react';
import { cn } from '../../utils/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className, ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full rounded-lg border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
          "focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent",
          "transition-colors duration-200",
          "min-h-[100px] resize-y",
          "text-center",
          error && "border-red-500 dark:border-red-400",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}