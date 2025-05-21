import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { ProjectCardProps } from '../../types/project';
import { CompactView } from './CompactView';
import { ProjectMedia } from './ProjectMedia';
import { ProjectHeader } from './ProjectHeader';
import { ProjectInfo } from './ProjectInfo';
import { ProjectNavigation } from './ProjectNavigation';
import { ProjectOverlay } from './ProjectOverlay';
import VideoSelector from './VideoSelector';
import Carousel from './Carousel';
import ShareDialog from '../ShareDialog';

function ProjectCard({
  title,
  shortDescription,
  fullDescription,
  image,
  video,
  videos,
  images,
  year,
  role,
  tools,
  index,
  totalProjects,
  allProjects
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const currentProject = allProjects[currentIndex];
  const location = useLocation();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < totalProjects - 1 && !isTransitioning) {
        handleNext(new MouseEvent('click') as React.MouseEvent);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0 && !isTransitioning) {
        handlePrevious(new MouseEvent('click') as React.MouseEvent);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const projectIndex = searchParams.get('project');
    if (projectIndex !== null) {
      const index = parseInt(projectIndex);
      if (!isNaN(index) && index >= 0 && index < allProjects.length) {
        setCurrentIndex(index);
        setIsExpanded(true);
      }
    }
  }, [location, allProjects.length]);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new CustomEvent('modalStateChange', { 
        detail: { isOpen: true } 
      }));
    } else {
      document.body.style.overflow = 'unset';
      window.dispatchEvent(new CustomEvent('modalStateChange', { 
        detail: { isOpen: false } 
      }));
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.dispatchEvent(new CustomEvent('modalStateChange', { 
        detail: { isOpen: false } 
      }));
    };
  }, [isExpanded]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < totalProjects - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setIsVideoPlaying(false);
      setCurrentImageIndex(0);
      setCurrentVideoIndex(0);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 100);
    }
  }, [currentIndex, totalProjects, isTransitioning]);

  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setIsVideoPlaying(false);
      setCurrentImageIndex(0);
      setCurrentVideoIndex(0);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 100);
    }
  }, [currentIndex, isTransitioning]);

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoPlaying(true);
  }, []);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setIsVideoPlaying(false);
    setCurrentImageIndex(0);
    setCurrentVideoIndex(0);
    setCurrentIndex(index);
    
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState({}, '', url.toString());
  }, [index]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded) {
      setIsExpanded(true);
      const url = new URL(window.location.href);
      url.searchParams.set('project', currentIndex.toString());
      window.history.replaceState({}, '', url.toString());
    }
  }, [isExpanded, currentIndex]);

  const generateShareUrl = useCallback(() => {
    const baseUrl = window.location.origin;
    const path = location.pathname;
    return `${baseUrl}${path}?project=${currentIndex}`;
  }, [location.pathname, currentIndex]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = generateShareUrl();
    window.history.replaceState({}, '', shareUrl);
    setIsShareDialogOpen(true);
  }, [generateShareUrl]);

  return (
    <div className="relative h-full">
      <div
        onClick={handleCardClick}
        className={`cursor-pointer h-full ${isExpanded ? 'z-[100]' : ''}`}
        style={{ position: isExpanded ? 'relative' : 'static' }}
      >
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col ${
            isExpanded ? 'fixed inset-4 md:inset-8 max-w-5xl mx-auto left-0 right-0 h-[95vh]' : 'h-full'
          }`}
          {...(isExpanded ? handlers : {})}
        >
          {!isExpanded ? (
            <CompactView
              title={title}
              shortDescription={shortDescription}
              image={image}
              video={video}
              videos={videos}
              role={role}
              tools={tools}
              year={year}
              onImageLoad={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="h-full flex flex-col">
              <div className="w-full h-[40vh] md:h-[50vh] relative">
                <ProjectMedia
                  project={currentProject}
                  isVideoPlaying={isVideoPlaying}
                  currentVideoIndex={currentVideoIndex}
                  handleVideoClick={handleVideoClick}
                  onImageLoad={() => setIsImageLoaded(true)}
                  setIsPlaying={setIsVideoPlaying}
                />
              </div>

              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                <ProjectHeader
                  title={currentProject.title}
                  handleShare={handleShare}
                  showCopied={showCopied}
                />

                {currentProject.videos && (
                  <VideoSelector
                    videos={currentProject.videos}
                    currentIndex={currentVideoIndex}
                    onSelect={setCurrentVideoIndex}
                  />
                )}

                <ProjectInfo
                  year={currentProject.year}
                  role={currentProject.role}
                  tools={currentProject.tools}
                />

                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-8">
                  {currentProject.fullDescription}
                </p>

                {currentProject.images && currentProject.images.length > 0 && (
                  <Carousel
                    currentImageIndex={currentImageIndex}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSelect={setCurrentImageIndex}
                    images={currentProject.images}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <ProjectNavigation
            currentIndex={currentIndex}
            totalProjects={totalProjects}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
          />
        </>
      )}

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        url={generateShareUrl()}
        title={currentProject.title}
        description={currentProject.shortDescription}
        image={currentProject.image}
      />

      {!isImageLoaded && !isExpanded && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
      )}
    </div>
  );
}

export default ProjectCard;