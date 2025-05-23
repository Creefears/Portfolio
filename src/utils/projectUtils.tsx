import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Project } from '../types/project';
import { formatVideoUrl, createIframeElement } from './videoUtils';

interface FormattedRole {
  role: string;
  colors: {
    bg: string;
    text: string;
  };
}

export const formatRoles = (roles: string): FormattedRole[] => {
  if (!roles) return [];
  
  const roleList = roles.split(',').map(role => role.trim());
  
  return roleList.map(role => {
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-800';
    
    if (role.toLowerCase().includes('réalisateur')) {
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
    } else if (role.toLowerCase().includes('monteur')) {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else if (role.toLowerCase().includes('production')) {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
    } else if (role.toLowerCase().includes('3d') || role.toLowerCase().includes('modeleur') || role.toLowerCase().includes('animateur')) {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    }

    return {
      role,
      colors: {
        bg: bgColor,
        text: textColor
      }
    };
  });
};

export const renderMedia = (
  project: { 
    videos?: Array<{ title: string; url: string }>;
    video?: string;
    image: string;
    title?: string;
  },
  isVideoPlaying: boolean,
  currentVideoIndex: number,
  handleVideoClick: (e: React.MouseEvent) => void,
  setIsPlaying?: (isPlaying: boolean) => void
) => {
  const containerClasses = "w-full h-full relative overflow-hidden";
  const mediaClasses = "absolute inset-0 w-full h-full object-cover";

  if (project.videos) {
    const currentVideo = project.videos[currentVideoIndex];
    const iframeHtml = createIframeElement(currentVideo.url, currentVideo.title);
    
    return (
      <div className={containerClasses}>
        <div 
          dangerouslySetInnerHTML={{ __html: iframeHtml }}
          className={mediaClasses}
          onLoad={() => setIsPlaying && setIsPlaying(true)}
        />
      </div>
    );
  }

  if (project.video && !isVideoPlaying) {
    const iframeHtml = project.video.startsWith('<iframe') ? project.video : null;
    
    return (
      <motion.div
        className={containerClasses}
        onClick={handleVideoClick}
        whileHover="hover"
      >
        {iframeHtml ? (
          <div 
            dangerouslySetInnerHTML={{ __html: iframeHtml }}
            className={mediaClasses}
          />
        ) : (
          <>
            <motion.img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className={mediaClasses}
              variants={{
                hover: { scale: 1.05 }
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/40"
              variants={{
                hover: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
              }}
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play className="w-14 h-14 text-white" />
              </motion.div>
            </motion.div>
          </>
        )}
      </motion.div>
    );
  }

  if (project.video) {
    const iframeHtml = createIframeElement(project.video, project.title);
    
    return (
      <div className={containerClasses}>
        <div 
          dangerouslySetInnerHTML={{ __html: iframeHtml }}
          className={mediaClasses}
          onLoad={() => setIsPlaying && setIsPlaying(true)}
        />
      </div>
    );
  }

  return (
    <img
      src={project.image}
      alt={project.title}
      loading="lazy"
      className={mediaClasses}
      onLoad={handleVideoClick}
    />
  );
};