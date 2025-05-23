import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image } from 'lucide-react';
import { Project } from '../../types/project';
import { ProjectInfo } from './ProjectInfo';
import Carousel from './Carousel';

interface TabContentProps {
  project: Project;
  currentImageIndex: number;
  handlePrevious: (e: React.MouseEvent) => void;
  handleNext: (e: React.MouseEvent) => void;
  handleImageSelect: (index: number) => void;
  setIsLightboxOpen: (isOpen: boolean) => void;
}

export function TabContent({
  project,
  currentImageIndex,
  handlePrevious,
  handleNext,
  handleImageSelect,
  setIsLightboxOpen
}: TabContentProps) {
  const [activeTab, setActiveTab] = React.useState<'description' | 'carousel'>('description');

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 md:px-8">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'description'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          Description
          {activeTab === 'description' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
            />
          )}
        </button>
        {project.images && project.images.length > 0 && (
          <button
            onClick={() => setActiveTab('carousel')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
              activeTab === 'carousel'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Image className="w-4 h-4" />
            Galerie
            {activeTab === 'carousel' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
              />
            )}
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto project-content">
        <AnimatePresence mode="wait">
          {activeTab === 'description' ? (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 md:p-8"
            >
              <ProjectInfo
                year={project.year}
                role={project.role}
                tools={project.tools}
              />
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {project.fulldescription}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 md:p-6"
            >
              <div className="max-w-2xl mx-auto">
                <Carousel
                  currentImageIndex={currentImageIndex}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSelect={handleImageSelect}
                  images={project.images || []}
                  setIsLightboxOpen={setIsLightboxOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}