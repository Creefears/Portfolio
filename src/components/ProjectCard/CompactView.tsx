import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import RoleBadges from './RoleBadges';
import ToolIcon from '../ToolIcon';
import { ProjectCardProps } from '../../types/project';

type CompactViewProps = Pick<ProjectCardProps, 'title' | 'shortDescription' | 'image' | 'video' | 'videos' | 'role' | 'tools' | 'year'> & {
  onImageLoad?: () => void;
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
};

export function CompactView({
  title,
  shortDescription,
  image,
  video,
  videos,
  role,
  tools,
  year,
  onImageLoad
}: CompactViewProps) {
  return (
    <motion.div 
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <div className="relative aspect-video">
        <img 
          src={image} 
          alt={title}
          loading="lazy"
          onLoad={onImageLoad}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Video Indicator */}
        {(video || videos) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        )}

        {/* Year Badge */}
        <motion.div 
          className="absolute top-2 right-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full"
          variants={itemVariants}
        >
          <span className="text-white text-sm font-medium">{year}</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.h3 
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3"
          variants={itemVariants}
        >
          {title}
        </motion.h3>

        <motion.p 
          className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2"
          variants={itemVariants}
        >
          {shortDescription}
        </motion.p>

        <motion.div 
          className="flex flex-col gap-4"
          variants={itemVariants}
        >
          <RoleBadges role={role} />
          <div className="flex flex-wrap gap-2">
            {tools.map((tool, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                custom={idx}
              >
                <ToolIcon 
                  name={typeof tool === 'string' ? tool : tool.name} 
                  size={16} 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          variants={itemVariants}
        >
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-white text-sm font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
              Cliquer pour plus de détails →
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}