import React from 'react';
import { motion } from 'framer-motion';

interface RoleBadgeProps {
  name: string;
  color: string;
  onClick?: () => void;
  selected?: boolean;
}

export function RoleBadge({ name, color, onClick, selected }: RoleBadgeProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        transition-colors duration-200
        ${selected ? 'ring-2 ring-offset-2' : ''}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        ringColor: color
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {name}
    </motion.button>
  );
}