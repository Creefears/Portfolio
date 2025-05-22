import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import ProjectCard from '../components/ProjectCard';
import CGIHeader from '../components/CGIHeader';
import ToolIcon from '../components/ToolIcon';
import { useProjectStore } from '../store/projectStore';
import { useToolStore } from '../store/toolStore';

function CGI() {
  const { userCGIProjects } = useProjectStore();
  const { tools } = useToolStore();
  
  const toolIds = [
    "Blender",
    "Unity",
    "Unreal Engine 5",
    "Adobe Premiere",
    "Adobe After Effects",
    "Adobe Photoshop",
    "Adobe Animate",
    "Autodesk Maya",
    "Substance Painter"
  ].map(name => tools.find(t => t.name === name)?.id).filter(Boolean) as string[];

  const projects = [...userCGIProjects].sort((a, b) => {
    const getLatestYear = (year: string) => {
      const years = year.split('-');
      return parseInt(years[years.length - 1]);
    };
    
    return getLatestYear(b.year) - getLatestYear(a.year);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CGIHeader />
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-8 md:mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
              Logiciels Maîtrisés
            </h2>
            <div className={clsx(
              "grid gap-2 md:gap-4 justify-items-center",
              "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9",
              "p-3 md:p-6",
              "bg-white/50 dark:bg-gray-800/50 rounded-xl"
            )}>
              {toolIds.map((id, index) => (
                <motion.div
                  key={id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.1 + 0.3,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                  }}
                >
                  <ToolIcon 
                    id={id}
                    size={24}
                    showLabel={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <ProjectCard 
                  {...project}
                  index={index}
                  totalProjects={projects.length}
                  allProjects={projects}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default CGI;