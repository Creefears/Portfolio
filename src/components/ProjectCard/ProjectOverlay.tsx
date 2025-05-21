import React from 'react';

interface ProjectOverlayProps {
  handleClose: (e: React.MouseEvent) => void;
}

export function ProjectOverlay({ handleClose }: ProjectOverlayProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      onClick={handleClose}
    />
  );
}