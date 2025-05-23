import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { createIframeElement } from '../../utils/videoUtils';

interface MediaPreviewProps {
  type: 'image' | 'video';
  url: string;
  onClose?: () => void;
}

export function MediaPreview({ type, url, onClose }: MediaPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleImageError = () => {
    setError("L'image n'a pas pu être chargée. Vérifiez l'URL.");
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) onClose();
  };

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400 text-sm text-center px-4">
          {error}
        </p>
        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  if (type === 'image') {
    if (url.startsWith('<iframe')) {
      return (
        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div 
            dangerouslySetInnerHTML={{ __html: url }}
            className="w-full h-full"
          />
          {onClose && (
            <motion.button
              type="button"
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      );
    }

    return (
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={url}
          alt="Prévisualisation"
          className="w-full h-full object-contain"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        {onClose && (
          <motion.button
            type="button"
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    );
  }

  if (type === 'video') {
    if (url.startsWith('<iframe')) {
      return (
        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div 
            dangerouslySetInnerHTML={{ __html: url }}
            className="w-full h-full"
          />
          {onClose && (
            <motion.button
              type="button"
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      );
    }

    if (!isPlaying) {
      return (
        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="p-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-8 h-8" />
            </motion.button>
          </div>
          {onClose && (
            <motion.button
              type="button"
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      );
    }

    return (
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div 
          dangerouslySetInnerHTML={{ __html: createIframeElement(url) }}
          className="w-full h-full"
        />
        {onClose && (
          <motion.button
            type="button"
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    );
  }

  return null;
}