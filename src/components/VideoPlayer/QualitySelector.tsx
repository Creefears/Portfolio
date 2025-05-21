import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface QualitySelectorProps {
  currentQuality: string;
  qualities: string[];
  onQualityChange: (quality: string) => void;
}

export function QualitySelector({ currentQuality, qualities, onQualityChange }: QualitySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full right-0 mb-2 w-36 bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden"
    >
      {qualities.map(quality => (
        <button
          key={quality}
          onClick={() => onQualityChange(quality)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
        >
          <span>{quality}</span>
          {quality === currentQuality && <Check className="w-4 h-4" />}
        </button>
      ))}
    </motion.div>
  );
}