import React from 'react';

interface ProjectOverlayProps {
  onClick: () => void;
}

const ProjectOverlay: React.FC<ProjectOverlayProps> = ({ onClick }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40"
      onClick={onClick}
    />
  );
};

export { ProjectOverlay };
