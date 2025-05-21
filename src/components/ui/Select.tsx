import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>;
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2 text-center">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full rounded-lg border border-white/20",
            "bg-white/10 text-white",
            "focus:ring-2 focus:ring-white/30 focus:border-transparent",
            "transition-colors duration-200",
            "text-center appearance-none",
            "pl-10 pr-10 py-2", // Added padding for icons
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-gray-800 text-white text-center"
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Left Icon */}
        {options.find(opt => opt.value === props.value)?.icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
            {options.find(opt => opt.value === props.value)?.icon}
          </div>
        )}
        {/* Custom Arrow Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}