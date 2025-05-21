import React from 'react';
import { motion } from 'framer-motion';

interface CharacterCountProps {
  current: number;
  max: number;
}

export function CharacterCount({ current, max }: CharacterCountProps) {
  const percentage = (current / max) * 100;
  const isWarning = percentage >= 80;
  const isError = percentage >= 100;

  return (
    <div className="flex items-center gap-2 justify-end mt-1">
      <div className="h-1 w-20 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            isError 
              ? 'bg-red-500' 
              : isWarning 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className={`text-xs ${
        isError 
          ? 'text-red-500' 
          : isWarning 
            ? 'text-yellow-500' 
            : 'text-gray-500 dark:text-gray-400'
      }`}>
        {current}/{max}
      </span>
    </div>
  );
}