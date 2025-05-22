import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';

function AnimatedHeader() {
  const navigate = useNavigate();
  const { userCGIProjects, userRealProjects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Combine and sort all projects by year
  const allProjects = [...userCGIProjects, ...userRealProjects].sort((a, b) => {
    const getLatestYear = (year: string) => {
      const years = year.split('-');
      return parseInt(years[years.length - 1]);
    };
    return getLatestYear(b.year) - getLatestYear(a.year);
  });

  // Duplicate projects array for seamless infinite scroll
  const duplicatedProjects = [...allProjects, ...allProjects];

  const handleProjectClick = (path: string, index: number) => {
    navigate(`${path}?project=${index}`);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-900">
      {/* Background grid of images with infinite scroll */}
      <div className="absolute inset-0 flex items-center">
        <motion.div
          className="flex gap-1 transform -rotate-12 scale-[1.4] translate-y-[-5%]"
          animate={{
            x: [0, -50 * allProjects.length],
          }}
          transition={{
            x: {
              duration: allProjects.length * 10,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          {duplicatedProjects.map((project, i) => (
            <motion.div
              key={`${project.id}-${i}`}
              className="relative h-[50vh] w-[25vw] min-w-[300px] overflow-hidden cursor-pointer"
              whileHover={{ 
                scale: 1.1, 
                zIndex: 10,
                opacity: 1,
                transition: { duration: 0.3 }
              }}
              onClick={() => handleProjectClick(
                project.type.toLowerCase() === 'cgi' ? '/cgi' : '/prise-de-vue-reel',
                allProjects.findIndex(p => p.id === project.id)
              )}
            >
              <motion.div 
                className="absolute inset-0 transition-all duration-300"
                whileHover={{ scale: 1.15 }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover brightness-[0.7]"
                  loading="lazy"
                />
              </motion.div>
              
              <motion.div 
                className="absolute inset-0 bg-black/30"
                whileHover={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="absolute inset-0 opacity-0"
                style={{
                  background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                }}
                whileHover={{
                  opacity: 1,
                  x: ['0%', '200%'],
                  transition: {
                    x: {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear"
                    }
                  }
                }}
              />

              <motion.div
                className="absolute inset-0 border-2 border-transparent"
                whileHover={{
                  borderColor: "rgba(255,255,255,0.3)",
                  boxShadow: "inset 0 0 30px rgba(255,255,255,0.2)"
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Project info */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 transition-all duration-300 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.h3
                  className="text-white font-bold text-2xl mb-3 drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  {project.title}
                </motion.h3>
                <motion.p
                  className="text-white text-sm px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  {project.role}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60 pointer-events-none z-15" />
    </div>
  );
}

export default AnimatedHeader;