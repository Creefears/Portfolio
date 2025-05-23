import { useState, useEffect, useRef } from 'react';

export function useVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [error, setError] = useState<{ message: string; retryable: boolean } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const maxRetries = 3;
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const qualities = ['1080p', '720p', '480p', '360p', 'auto'];

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (error) return;
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleSeekChange = (value: number) => {
    if (error || !duration) return;
    setPlayed(value);
  };

  const handleSeekMouseDown = () => {
    if (error || !duration) return;
    setSeeking(true);
  };

  const handleSeekMouseUp = (value: number) => {
    if (error || !duration) return;
    setSeeking(false);
    setPlayed(value);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!seeking && !error) {
      const video = e.target as HTMLVideoElement;
      if (video.duration && !isNaN(video.duration)) {
        setPlayed(video.currentTime / video.duration);
        setDuration(video.duration);
      }
    }
  };

  const handleProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (error) return;
    const video = e.target as HTMLVideoElement;
    if (video.buffered.length > 0) {
      setLoaded(video.buffered.end(video.buffered.length - 1) / video.duration);
    }
  };

  const handleDuration = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    if (video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }
  };

  const handleFullscreen = () => {
    if (error) return;
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleQualityChange = (quality: string) => {
    setCurrentQuality(quality);
    // Quality switching logic would go here
  };

  const retryLoad = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(null);
      setIsBuffering(true);
      setIsReady(false);
      
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      retryTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, delay);
    }
  };

  const validateVideoUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleError = (error: any) => {
    console.error('Video player error:', {
      error,
      type: error?.type,
      code: error?.code,
      message: error?.message,
      name: error?.name,
      target: {
        error: error?.target?.error,
        src: videoRef.current?.src,
        readyState: videoRef.current?.readyState,
        networkState: videoRef.current?.networkState
      }
    });
    
    setIsPlaying(false);
    setPlayed(0);
    setLoaded(0);
    setIsBuffering(false);
    setIsReady(false);

    let errorMessage = 'Error loading video. Please try again later.';
    let isRetryable = true;

    // Check if the video source is valid
    if (videoRef.current?.src && !validateVideoUrl(videoRef.current.src)) {
      errorMessage = 'Invalid video URL provided.';
      isRetryable = false;
    }
    // Check for specific error types
    else if (error?.type === 'missing_api_key' || error?.message?.includes('API key')) {
      errorMessage = 'Unable to play video: Missing or invalid API key.';
      isRetryable = false;
    }
    else if (error?.code === 'MEDIA_ERR_SRC_NOT_SUPPORTED' || error?.target?.error?.code === 3) {
      errorMessage = 'Video format not supported by your browser.';
      isRetryable = false;
    }
    else if (error?.code === 'MEDIA_ERR_NETWORK' || error?.target?.error?.code === 2) {
      errorMessage = 'Network error occurred while loading the video. Check your internet connection.';
      isRetryable = true;
      retryLoad();
    }
    else if (error?.code === 'MEDIA_ERR_DECODE' || error?.target?.error?.code === 3) {
      errorMessage = 'Error occurred while decoding the video. The file might be corrupted.';
      isRetryable = true;
    }
    else if (error?.code === 'MEDIA_ERR_ABORTED' || error?.target?.error?.code === 1) {
      errorMessage = 'Video loading was aborted.';
      isRetryable = true;
    }
    else if (error?.target?.error?.code === 4) {
      errorMessage = 'Video not found or access denied. Please check the video URL and permissions.';
      isRetryable = false;
    }
    // Handle Google Drive specific errors
    else if (error?.message?.includes('drive') || videoRef.current?.src?.includes('drive.google.com')) {
      errorMessage = 'Error loading Google Drive video. Please check the sharing permissions.';
      isRetryable = false;
    }
    // Handle CORS errors
    else if (error?.message?.includes('CORS') || error?.message?.includes('cross-origin')) {
      errorMessage = 'Cross-origin error: Unable to load video from this source.';
      isRetryable = false;
    }

    setError({
      message: errorMessage,
      retryable: isRetryable && retryCount < maxRetries
    });
  };

  const handleRetry = () => {
    retryLoad();
  };

  return {
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
    setIsPlaying,
    setPlayed,
    setDuration,
    videoRef
  };
}