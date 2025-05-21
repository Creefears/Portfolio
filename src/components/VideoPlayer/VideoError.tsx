import React from 'react';
import { RefreshCw } from 'lucide-react';

interface VideoErrorProps {
  error: { message: string; retryable: boolean } | null;
  onRetry: () => void;
}

export function VideoError({ error, onRetry }: VideoErrorProps) {
  if (!error) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
      <p className="text-white text-center mb-4">{error.message}</p>
      {error.retryable && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}