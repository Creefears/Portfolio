import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoControls } from './VideoControls';
import { VideoError } from './VideoError';
import { VideoLoading } from './VideoLoading';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { formatVideoUrl } from '../../utils/projectUtils';

interface VideoPlayerProps {
  url: string;
  title?: string;
  setIsPlaying: (isPlaying: boolean) => void;
}

export function VideoPlayer({ url, title, setIsPlaying }: VideoPlayerProps) {
  const {
    isPlaying,
    volume,
    muted,
    played,
    loaded,
    duration,
    seeking,
    isFullscreen,
    showControls,
    isBuffering,
    error,
    isReady,
    currentQuality,
    qualities,
    handlePlayPause,
    handleVolumeChange,
    handleToggleMute,
    handleSeekChange,
    handleSeekMouseDown,
    handleSeekMouseUp,
    handleTimeUpdate,
    handleProgress,
    handleDuration,
    handleFullscreen,
    handleError,
    handleRetry,
    handleQualityChange,
    setShowControls,
    setIsBuffering,
    setIsReady,
    videoRef
  } = useVideoPlayer();

  const containerRef = useRef<HTMLDivElement>(null);
  const formattedUrl = url ? formatVideoUrl(url) : '';
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be');
  const isIframe = url?.startsWith('<iframe');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [url]);

  useEffect(() => {
    if (!isYouTube && !isIframe && videoRef.current) {
      try {
        if (isPlaying) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error('Play promise error:', error);
              handleError(error);
              setIsPlaying(false);
            });
          }
        } else {
          videoRef.current.pause();
        }
      } catch (error) {
        console.error('Video playback error:', error);
        handleError(error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, isYouTube, isIframe, setIsPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (isPlaying) {
      setTimeout(() => setShowControls(false), 2000);
    }
  };

  if (!url) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <p className="text-white">No video URL provided</p>
      </div>
    );
  }

  if (isIframe) {
    return (
      <div className="relative w-full h-full bg-black">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: url.replace(
              '<iframe',
              '<iframe style="width:100%; height:100%; border:0; object-fit:contain;"'
            )
          }} 
          className="absolute inset-0"
        />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isYouTube ? (
          <iframe
            src={`https://www.youtube.com/embed/${formattedUrl}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 0 }}
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={formattedUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onProgress={handleProgress}
              onDurationChange={handleDuration}
              onError={handleError}
              onPlaying={() => {
                setIsBuffering(false);
                setIsReady(true);
                setIsPlaying(true);
              }}
              onPause={() => {
                setIsPlaying(false);
              }}
              onWaiting={() => setIsBuffering(true)}
              onCanPlay={() => setIsBuffering(false)}
              playsInline
              style={{ backgroundColor: 'black' }}
            />

            <VideoLoading isBuffering={isBuffering} isReady={isReady} error={error} />
            <VideoError error={error} onRetry={handleRetry} />

            <AnimatePresence>
              {showControls && !error && (
                <VideoControls
                  isPlaying={isPlaying}
                  volume={volume}
                  muted={muted}
                  played={played}
                  loaded={loaded}
                  duration={duration}
                  currentQuality={currentQuality}
                  qualities={qualities}
                  onPlayPause={handlePlayPause}
                  onVolumeChange={handleVolumeChange}
                  onToggleMute={handleToggleMute}
                  onSeekChange={handleSeekChange}
                  onSeekMouseDown={handleSeekMouseDown}
                  onSeekMouseUp={handleSeekMouseUp}
                  onFullscreen={handleFullscreen}
                  onQualityChange={handleQualityChange}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <style>{`
        :fullscreen {
          background: black;
          width: 100vw !important;
          height: 100vh !important;
        }
        
        ::backdrop {
          background: black;
        }
        
        video::-webkit-media-controls {
          display: none !important;
        }
        
        video::-webkit-media-controls-enclosure {
          display: none !important;
        }
      `}</style>
    </div>
  );
}