import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectNavigationProps {
  currentIndex: number;
  totalProjects: number;
  handlePrevious: (e: React.MouseEvent) => void;
  handleNext: (e: React.MouseEvent) => void;
}

export function ProjectNavigation({
  currentIndex,
  totalProjects,
  handlePrevious,
  handleNext
}: ProjectNavigationProps) {
  return (
    <>
      {/* Mobile navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-[102] md:hidden">
        {currentIndex > 0 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
        )}
        {currentIndex < totalProjects - 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        )}
      </div>

      {/* Desktop navigation */}
      {currentIndex > 0 && (
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevious}
          className="fixed top-1/2 left-4 md:left-8 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-[102] group hidden md:block"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="absolute left-full ml-2 whitespace-nowrap bg-black/50 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Projet précédent
          </span>
        </motion.button>
      )}

      {currentIndex < totalProjects - 1 && (
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="fixed top-1/2 right-4 md:right-8 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-[102] group hidden md:block"
        >
          <ChevronRight className="h-6 w-6" />
          <span className="absolute right-full mr-2 whitespace-nowrap bg-black/50 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Projet suivant
          </span>
        </motion.button>
      )}
    </>
  );
}