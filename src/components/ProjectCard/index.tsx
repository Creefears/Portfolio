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
import { useToolStore } from '../../store/toolStore';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';

function ProjectCard({
  title,
  shortdescription,
  fulldescription,
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'gallery'>('description');
  const currentProject = allProjects[currentIndex];
  const location = useLocation();
  const { tools: allTools, fetchTools } = useToolStore();

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const slugify = (text: string) =>
    text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isLightboxOpen && currentIndex < totalProjects - 1 && !isTransitioning) {
        handleNext(new MouseEvent('click') as React.MouseEvent);
      }
    },
    onSwipedRight: () => {
      if (!isLightboxOpen && currentIndex > 0 && !isTransitioning) {
        handlePrevious(new MouseEvent('click') as React.MouseEvent);
      }
    },
    preventDefaultTouchmoveEvent: false,
    trackMouse: false
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const projectSlug = searchParams.get('project');
    const currentSlug = slugify(title);
    if (projectSlug === currentSlug) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [location.search, title]);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new CustomEvent('modalStateChange', { detail: { isOpen: true } }));
    } else {
      document.body.style.overflow = 'unset';
      window.dispatchEvent(new CustomEvent('modalStateChange', { detail: { isOpen: false } }));
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.dispatchEvent(new CustomEvent('modalStateChange', { detail: { isOpen: false } }));
    };
  }, [isExpanded]);

  const getProjectTools = (projectTools: any[]) => {
    return projectTools.map(tool => {
      if (typeof tool === 'string') {
        return allTools.find(t => t.id === tool || t.name === tool);
      }
      return allTools.find(t => t.id === tool.id || t.name === tool.name);
    }).filter(Boolean);
  };

  const currentTools = getProjectTools(currentProject.tools || []);
  const compactTools = getProjectTools(tools || []);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLightboxOpen && currentIndex < totalProjects - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setIsVideoPlaying(false);
      setCurrentImageIndex(0);
      setCurrentVideoIndex(0);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 100);
    }
  }, [currentIndex, totalProjects, isTransitioning, isLightboxOpen]);

  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLightboxOpen && currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setIsVideoPlaying(false);
      setCurrentImageIndex(0);
      setCurrentVideoIndex(0);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 100);
    }
  }, [currentIndex, isTransitioning, isLightboxOpen]);

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
    setActiveTab('description');

    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState({}, '', url.toString());
  }, [index]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded) {
      setIsExpanded(true);
      const slug = slugify(title);
      const url = new URL(window.location.href);
      url.searchParams.set('project', slug);
      window.history.replaceState({}, '', url.toString());
    }
  }, [isExpanded, title]);

  const generateShareUrl = useCallback(() => {
    const baseUrl = window.location.origin;
    const path = location.pathname;
    const slug = slugify(title);
    return `${baseUrl}${path}?project=${slug}`;
  }, [location.pathname, title]);

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
          {isExpanded && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black bg-opacity-50 text-white rounded-full md:hidden"
              aria-label="Fermer"
            >
              ✕
            </button>
          )}

          {!isExpanded ? (
            <CompactView
              title={title}
              shortDescription={shortdescription}
              image={image}
              video={video}
              videos={videos}
              role={role}
              tools={compactTools}
              year={year}
              onImageLoad={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="h-full flex flex-col">
              <div className="w-full h-[30vh] md:h-[40vh] relative">
                <ProjectMedia
                  project={currentProject}
                  isVideoPlaying={isVideoPlaying}
                  currentVideoIndex={currentVideoIndex}
                  handleVideoClick={handleVideoClick}
                  onImageLoad={() => setIsImageLoaded(true)}
                  setIsPlaying={setIsVideoPlaying}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="p-6 md:p-8">
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
                    tools={currentTools}
                  />
                </div>

                <div className="px-6 md:px-8">
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'description' | 'gallery')}>
                    <TabsList>
                      <TabsTrigger value="description">Description</TabsTrigger>
                      {currentProject.images && currentProject.images.length > 0 && (
                        <TabsTrigger value="gallery">Galerie</TabsTrigger>
                      )}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto project-content">
                  {activeTab === 'description' ? (
                    <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                      {currentProject.fulldescription}
                    </p>
                  ) : (
                    currentProject.images && (
                      <Carousel
                        currentImageIndex={currentImageIndex}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        onSelect={setCurrentImageIndex}
                        images={currentProject.images}
                        setIsLightboxOpen={setIsLightboxOpen}
                      />
                    )
                  )}
                </div>
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
          {!isLightboxOpen && (
            <ProjectNavigation
              currentIndex={currentIndex}
              totalProjects={totalProjects}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
            />
          )}
        </>
      )}

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        url={generateShareUrl()}
        title={currentProject.title}
        description={currentProject.shortdescription}
        image={currentProject.image}
      />

      {!isImageLoaded && !isExpanded && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
      )}
    </div>
  );
}

export default ProjectCard;