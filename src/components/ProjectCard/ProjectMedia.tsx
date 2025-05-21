import React from 'react';
import { motion } from 'framer-motion';
import { renderMedia } from '../../utils/projectUtils';
import { Project } from '../../types/project';

interface ProjectMediaProps {
  project: Project;
  isVideoPlaying: boolean;
  currentVideoIndex: number;
  handleVideoClick: (e: React.MouseEvent) => void;
  onImageLoad?: () => void;
  className?: string;
  setIsPlaying: (isPlaying: boolean) => void;
}

const mediaVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

export function ProjectMedia({
  project,
  isVideoPlaying,
  currentVideoIndex,
  handleVideoClick,
  onImageLoad,
  className = '',
  setIsPlaying
}: ProjectMediaProps) {
  return (
    <motion.div 
      className={`w-full h-full ${className}`}
      variants={mediaVariants}
      initial="hidden"
      animate="visible"
    >
      {renderMedia(
        project,
        isVideoPlaying,
        currentVideoIndex,
        handleVideoClick,
        setIsPlaying
      )}
    </motion.div>
  );
}