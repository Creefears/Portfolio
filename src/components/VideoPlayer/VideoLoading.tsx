import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoLoadingProps {
  isBuffering: boolean;
  isReady: boolean;
  error: { message: string; retryable: boolean } | null;
}

export function VideoLoading({ isBuffering, isReady, error }: VideoLoadingProps) {
  if (!isBuffering && isReady || error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center bg-black/50"
      >
        <div className="w-16 h-16 border-4 border-gray-400 border-t-white rounded-full animate-spin" />
      </motion.div>
    </AnimatePresence>
  );
}