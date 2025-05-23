import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Video } from '../../types/project';

interface VideoSelectorProps {
  videos: Video[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default React.memo(function VideoSelector({ 
  videos, 
  currentIndex, 
  onSelect 
}: VideoSelectorProps) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {videos.map((video, idx) => (
        <motion.button
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(idx);
          }}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
            idx === currentIndex
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
            {video.thumbnail ? (
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/40 ${
              idx === currentIndex ? 'opacity-0' : 'opacity-100'
            }`}>
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-sm font-medium flex-1 text-left">{video.title}</span>
        </motion.button>
      ))}
    </div>
  );
});