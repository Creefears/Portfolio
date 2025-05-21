import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';

export function ProjectBanner() {
  const { userCGIProjects, userRealProjects } = useProjectStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const controls = useAnimation();

  // Combine and sort all projects by creation date
  const allProjects = [...userCGIProjects, ...userRealProjects]
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });

  // Fallback image for missing covers
  const fallbackImage = "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const bannerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={controls}
      variants={bannerVariants}
      className="relative w-full overflow-hidden bg-gray-900 py-12"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
      
      <motion.div
        animate={{
          x: [0, -50],
          transition: {
            x: {
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }
          }
        }}
        className="flex gap-4"
      >
        {[...allProjects, ...allProjects].map((project, index) => (
          <Link
            key={`${project.id}-${index}`}
            to={`/${project.type?.toLowerCase() === 'cgi' ? 'cgi' : 'prise-de-vue-reel'}?project=${index % allProjects.length}`}
            className="relative flex-none w-72 h-48 overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105"
          >
            <motion.img
              src={project.image || fallbackImage}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-lg font-semibold truncate">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm truncate">
                  {project.shortdescription}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}