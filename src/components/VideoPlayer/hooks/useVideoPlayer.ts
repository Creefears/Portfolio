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
    if (!url) return false;
    try {
      new URL(url);
      // Check for common video file extensions
      const validExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
      return validExtensions.some(ext => url.toLowerCase().endsWith(ext)) || 
             url.includes('blob:') || // Handle blob URLs
             /^https?:\/\/[^/]+\/(api|stream|video)/i.test(url); // Handle API endpoints
    } catch {
      return false;
    }
  };

  const handleError = (error: any) => {
    // Early return if no video element is present
    if (!videoRef.current) {
      setError({
        message: 'Video player not initialized properly.',
        retryable: false
      });
      return;
    }

    // Get detailed video element state
    const videoState = {
      src: videoRef.current.src,
      readyState: videoRef.current.readyState,
      networkState: videoRef.current.networkState,
      error: videoRef.current.error,
      paused: videoRef.current.paused,
      currentTime: videoRef.current.currentTime,
      duration: videoRef.current.duration,
      ended: videoRef.current.ended,
      seeking: videoRef.current.seeking,
      stalled: videoRef.current.stalled,
    };

    console.error('Video player error:', {
      error,
      videoState,
      browserInfo: {
        userAgent: navigator.userAgent,
        vendor: navigator.vendor,
        platform: navigator.platform,
      }
    });
    
    setIsPlaying(false);
    setPlayed(0);
    setLoaded(0);
    setIsBuffering(false);
    setIsReady(false);

    let errorMessage = 'Error loading video. Please try again later.';
    let isRetryable = true;

    // Source validation
    if (!videoRef.current.src) {
      errorMessage = 'No video source provided.';
      isRetryable = false;
    }
    else if (!validateVideoUrl(videoRef.current.src)) {
      errorMessage = 'Invalid video URL or unsupported format.';
      isRetryable = false;
    }
    // Network errors
    else if (videoState.networkState === 3) { // NETWORK_NO_SOURCE
      errorMessage = 'Video source not found or access denied.';
      isRetryable = true;
    }
    else if (videoState.networkState === 2) { // NETWORK_LOADING
      errorMessage = 'Network error while loading video.';
      isRetryable = true;
    }
    // Media errors
    else if (videoState.error) {
      switch (videoState.error.code) {
        case 1: // MEDIA_ERR_ABORTED
          errorMessage = 'Video loading was aborted.';
          isRetryable = true;
          break;
        case 2: // MEDIA_ERR_NETWORK
          errorMessage = 'Network error occurred. Check your connection.';
          isRetryable = true;
          break;
        case 3: // MEDIA_ERR_DECODE
          errorMessage = 'Video format not supported or file is corrupted.';
          isRetryable = false;
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          errorMessage = 'Video format not supported by your browser.';
          isRetryable = false;
          break;
        default:
          errorMessage = `Video error: ${videoState.error.message}`;
          isRetryable = true;
      }
    }
    // CORS errors
    else if (error?.message?.includes('CORS') || error?.name === 'SecurityError') {
      errorMessage = 'Access to video blocked by CORS policy.';
      isRetryable = false;
    }
    // Stalled playback
    else if (videoState.stalled) {
      errorMessage = 'Video playback stalled. Check your connection.';
      isRetryable = true;
    }
    // Timeout
    else if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
      errorMessage = 'Video loading timed out. Try again.';
      isRetryable = true;
    }

    setError({
      message: errorMessage,
      retryable: isRetryable && retryCount < maxRetries
    });

    if (isRetryable && retryCount < maxRetries) {
      retryLoad();
    }
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