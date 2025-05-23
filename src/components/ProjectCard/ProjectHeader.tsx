import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';

interface ProjectHeaderProps {
  title: string;
  handleShare: (e: React.MouseEvent) => void;
  showCopied: boolean;
}

export function ProjectHeader({ title, handleShare, showCopied }: ProjectHeaderProps) {
  return (
    <div className="relative flex items-center justify-center mt-8 mb-6 px-6 md:px-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
          {title}
        </h2>
        <div className="w-24 h-0.5 bg-indigo-500 dark:bg-indigo-400 mt-3 rounded-full" />
      </div>
      <motion.button
        onClick={handleShare}
        className="absolute right-6 md:right-8 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showCopied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
        <span className="absolute right-full mr-2 whitespace-nowrap bg-gray-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {showCopied ? 'Lien copié !' : 'Partager'}
        </span>
      </motion.button>
    </div>
  );
}