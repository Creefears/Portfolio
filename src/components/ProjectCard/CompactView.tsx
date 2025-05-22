import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import RoleBadges from './RoleBadges';
import ToolIcon from '../ToolIcon';
import { ProjectCardProps } from '../../types/project';
import { useToolStore } from '../../store/toolStore';

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
  const { tools: allTools } = useToolStore();

  const projectTools = (tools || []).map(t =>
    allTools.find(tool => typeof t === 'string' ? tool.id === t : tool.id === t.id)
  ).filter(Boolean);

  return (
    <motion.div 
      className="h-full flex flex-col"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative w-full pb-[56.25%] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={title}
            loading="lazy"
            onLoad={onImageLoad}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          {/* Year badge */}
          <motion.div 
            className="absolute top-2 right-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full"
            variants={itemVariants}
          >
            <span className="text-white text-sm font-medium">{year}</span>
          </motion.div>
          {(video || videos) && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      <motion.div 
        className="p-6 flex-1 flex flex-col"
        variants={contentVariants}
      >
        <motion.h3 
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center"
          variants={itemVariants}
        >
          {title}
        </motion.h3>
        <motion.div 
          className="w-16 h-0.5 bg-indigo-500 dark:bg-indigo-400 mx-auto mb-4 rounded-full"
          variants={itemVariants}
        />
        <motion.p 
          className="text-gray-600 dark:text-gray-400 mb-4 flex-grow text-center"
          variants={itemVariants}
        >
          {shortDescription}
        </motion.p>
        <motion.div 
          className="mt-auto"
          variants={contentVariants}
        >
          <motion.div 
            className="flex flex-col items-center gap-4 mb-4"
            variants={itemVariants}
          >
            <RoleBadges role={role} />
            <div className="flex justify-center gap-2">
              {projectTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  variants={itemVariants}
                >
                  <ToolIcon id={tool.id} size={16} />
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.p 
            className="text-sm text-indigo-600 dark:text-indigo-400 text-center"
            variants={itemVariants}
          >
            Cliquer pour plus de détails →
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}