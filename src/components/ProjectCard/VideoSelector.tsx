import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoSelectorProps {
  videos: Array<{ title: string; url: string }>;
  currentIndex: number;
  onSelect: (index: number) => void;
}

const VideoSelector = React.memo(function VideoSelector({ 
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
          <Play className={`w-5 h-5 ${
            idx === currentIndex ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
          }`} />
          <span className="text-sm font-medium">{video.title}</span>
        </motion.button>
      ))}
    </div>
  );
});

export default VideoSelector;