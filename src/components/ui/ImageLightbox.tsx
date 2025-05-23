import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious
}: ImageLightboxProps) {
  if (!isOpen) return null;

  // Filter out iframes
  const displayableImages = images.filter(img => !img.startsWith('<iframe'));
  const displayableIndex = displayableImages.indexOf(images[currentIndex]);

  if (displayableIndex === -1) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 z-[202]"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Image container */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.img
            key={displayableIndex}
            src={displayableImages[displayableIndex]}
            alt={`Image ${displayableIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Navigation buttons */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4 z-[202]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
            disabled={displayableIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="flex items-center px-4 py-2 bg-black/50 rounded-full text-white backdrop-blur-sm">
            {displayableIndex + 1} / {displayableImages.length}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
            disabled={displayableIndex === displayableImages.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}