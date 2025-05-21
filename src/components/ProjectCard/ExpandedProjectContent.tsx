import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { Project } from '../../types/project';
import RoleBadges from './RoleBadges';
import VideoSelector from './VideoSelector';
import Carousel from './Carousel';
import ToolIcon from '../ToolIcon';
import { renderMedia } from '../../utils/projectUtils';

interface ExpandedProjectContentProps {
  project: Project;
  isVideoPlaying: boolean;
  currentVideoIndex: number;
  currentImageIndex: number;
  handleVideoClick: (e: React.MouseEvent) => void;
  handleShare: (e: React.MouseEvent) => void;
  handleVideoSelect: (index: number) => void;
  handlePreviousImage: (e: React.MouseEvent) => void;
  handleNextImage: (e: React.MouseEvent) => void;
  handleImageSelect: (index: number) => void;
  showCopied: boolean;
}

const ExpandedProjectContent = React.memo(function ExpandedProjectContent({
  project,
  isVideoPlaying,
  currentVideoIndex,
  currentImageIndex,
  handleVideoClick,
  handleShare,
  handleVideoSelect,
  handlePreviousImage,
  handleNextImage,
  handleImageSelect,
  showCopied
}: ExpandedProjectContentProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mediaHeight, setMediaHeight] = useState('56.25%');

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setIsScrolled(target.scrollTop > 50);
      
      const scrollPercentage = Math.min(target.scrollTop / 300, 1);
      const minHeight = 30;
      const maxHeight = 56.25;
      const newHeight = maxHeight - (scrollPercentage * (maxHeight - minHeight));
      setMediaHeight(`${newHeight}%`);
    };

    const contentElement = document.querySelector('.project-content');
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <motion.div 
        className="relative w-full"
        animate={{
          height: mediaHeight
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0">
          {renderMedia(project, isVideoPlaying, currentVideoIndex, handleVideoClick)}
        </div>
      </motion.div>

      <div className="project-content flex-grow overflow-y-auto">
        <div className="p-6">
          <div className="relative flex items-center justify-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
              {project.title}
            </h2>
            <div className="absolute w-24 h-0.5 bg-indigo-500 dark:bg-indigo-400 bottom-[-0.75rem] rounded-full" />
            <motion.button
              onClick={handleShare}
              className="absolute right-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showCopied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
              <span className="absolute right-full mr-2 whitespace-nowrap bg-gray-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {showCopied ? 'Lien copié !' : 'Partager'}
              </span>
            </motion.button>
          </div>
          
          {project.videos && (
            <VideoSelector
              videos={project.videos}
              currentIndex={currentVideoIndex}
              onSelect={handleVideoSelect}
            />
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Année</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.year}</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Rôle</h3>
              <div className="flex justify-center">
                <RoleBadges role={project.role} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Outils</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {project.tools.map((tool, idx) => (
                  <ToolIcon key={idx} name={tool.name} size={20} />
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {project.fullDescription}
          </p>

          {project.images && project.images.length > 0 && (
            <Carousel
              currentImageIndex={currentImageIndex}
              onPrevious={handlePreviousImage}
              onNext={handleNextImage}
              onSelect={handleImageSelect}
              images={project.images}
            />
          )}
        </div>
      </div>
    </div>
  );
});