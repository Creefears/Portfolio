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
    return (
      <div className={containerClasses}>
        <div 
          dangerouslySetInnerHTML={{ __html: createIframeElement(currentVideo.url, currentVideo.title) }}
          className={mediaClasses}
          onLoad={() => setIsPlaying && setIsPlaying(true)}
        />
      </div>
    );
  }

  if (project.video) {
    return (
      <div className={containerClasses}>
        <div 
          dangerouslySetInnerHTML={{ __html: createIframeElement(project.video, project.title) }}
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