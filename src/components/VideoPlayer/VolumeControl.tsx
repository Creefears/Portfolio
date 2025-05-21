import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onToggleMute
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-2 group">
      <button
        onClick={onToggleMute}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        {muted || volume === 0 ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>

      <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-200">
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={muted ? 0 : volume}
          onChange={e => onVolumeChange(parseFloat(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>
    </div>
  );
}