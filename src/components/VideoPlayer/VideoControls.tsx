import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize, Settings } from 'lucide-react';
import { Timeline } from './Timeline';
import { VolumeControl } from './VolumeControl';
import { QualitySelector } from './QualitySelector';

interface VideoControlsProps {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  currentQuality: string;
  qualities: string[];
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSeekChange: (value: number) => void;
  onSeekMouseDown: () => void;
  onSeekMouseUp: (value: number) => void;
  onFullscreen: () => void;
  onQualityChange: (quality: string) => void;
}

export function VideoControls({
  isPlaying,
  volume,
  muted,
  played,
  loaded,
  duration,
  currentQuality,
  qualities,
  onPlayPause,
  onVolumeChange,
  onToggleMute,
  onSeekChange,
  onSeekMouseDown,
  onSeekMouseUp,
  onFullscreen,
  onQualityChange
}: VideoControlsProps) {
  const [showQualitySelector, setShowQualitySelector] = useState(false);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent"
    >
      <div className="p-4 space-y-4">
        <Timeline
          played={played}
          loaded={loaded}
          duration={duration}
          onSeekChange={onSeekChange}
          onSeekMouseDown={onSeekMouseDown}
          onSeekMouseUp={onSeekMouseUp}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onPlayPause}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <VolumeControl
              volume={volume}
              muted={muted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
            />

            <div className="text-white text-sm">
              {formatTime(played * duration)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowQualitySelector(!showQualitySelector)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>

              <AnimatePresence>
                {showQualitySelector && (
                  <QualitySelector
                    currentQuality={currentQuality}
                    qualities={qualities}
                    onQualityChange={(quality) => {
                      onQualityChange(quality);
                      setShowQualitySelector(false);
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={onFullscreen}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Maximize className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}