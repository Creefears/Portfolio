import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ImageLightbox } from '../ui/ImageLightbox';

interface CarouselProps {
  currentImageIndex: number;
  onPrevious: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onSelect: (index: number) => void;
  images: string[];
  setIsLightboxOpen: (isOpen: boolean) => void;
}

const Carousel = React.memo(function Carousel({
  currentImageIndex,
  onPrevious,
  onNext,
  onSelect,
  images,
  setIsLightboxOpen
}: CarouselProps) {
  const [isLightboxOpen, setIsLightboxLocalOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      onSelect(currentImageIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      onSelect(currentImageIndex + 1);
    }
  };

  const handleLightboxOpen = () => {
    setIsLightboxLocalOpen(true);
    setIsLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setIsLightboxLocalOpen(false);
    setIsLightboxOpen(false);
  };

  return (
    <div className="mt-8" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Galerie Photos
        </h3>
        <div className="w-16 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full" />
      </div>
      <div className="relative">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden"
        >
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handleLightboxOpen}
          >
            <div className="w-full h-full flex items-center justify-center bg-black">
              {images[currentImageIndex].startsWith('<iframe') ? (
                <div
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{
                    __html: images[currentImageIndex].replace(
                      '<iframe',
                      '<iframe style="width:100%; height:100%; object-fit:contain;"'
                    ),
                  }}
                />
              ) : (
                <img
                  src={images[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              )}
            </div>
          </div>
          
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
              disabled={currentImageIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
              disabled={currentImageIndex === images.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
        
        <div className="flex justify-center mt-4 gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentImageIndex
                  ? 'bg-indigo-600 dark:bg-indigo-400 w-4'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <ImageLightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={handleLightboxClose}
        onNext={() => {
          if (currentImageIndex < images.length - 1) {
            onSelect(currentImageIndex + 1);
          }
        }}
        onPrevious={() => {
          if (currentImageIndex > 0) {
            onSelect(currentImageIndex - 1);
          }
        }}
      />
    </div>
  );
});

export default Carousel;