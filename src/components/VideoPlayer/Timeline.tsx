import React from 'react';

interface TimelineProps {
  played: number;
  loaded: number;
  duration: number;
  onSeekChange: (value: number) => void;
  onSeekMouseDown: () => void;
  onSeekMouseUp: (value: number) => void;
}

export function Timeline({
  played,
  loaded,
  duration,
  onSeekChange,
  onSeekMouseDown,
  onSeekMouseUp
}: TimelineProps) {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    onSeekMouseDown();
    handleSeek(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const value = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    onSeekMouseUp(value);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const value = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    onSeekChange(value);
  };

  return (
    <div
      className="relative h-1 bg-white/30 cursor-pointer group"
      onMouseDown={handleMouseDown}
      onMouseMove={e => e.buttons === 1 && handleSeek(e)}
      onMouseUp={handleMouseUp}
    >
      {/* Loaded progress */}
      <div
        className="absolute h-full bg-white/50"
        style={{ width: `${loaded * 100}%` }}
      />

      {/* Played progress */}
      <div
        className="absolute h-full bg-indigo-500"
        style={{ width: `${played * 100}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full transform scale-0 group-hover:scale-100 transition-transform" />
      </div>
    </div>
  );
}