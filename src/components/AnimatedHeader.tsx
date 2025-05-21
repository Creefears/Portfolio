import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjectStore } from '../store/projectStore';

function AnimatedHeader() {
  const navigate = useNavigate();
  const { userCGIProjects, userRealProjects } = useProjectStore();
  
  // Combine all projects and get their images
  const allProjectImages = [...userCGIProjects, ...userRealProjects]
    .map(project => ({
      image: project.image,
      role: project.role,
      company: project.title,
      path: project.type?.toLowerCase() === 'cgi' ? '/cgi' : '/prise-de-vue-reel',
      index: project.type?.toLowerCase() === 'cgi' 
        ? userCGIProjects.findIndex(p => p.id === project.id)
        : userRealProjects.findIndex(p => p.id === project.id)
    }));

  const handleProjectClick = (path: string, index: number) => {
    navigate(`${path}?project=${index}`);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-4 gap-1 transform -rotate-12 scale-[1.4] translate-y-[-5%] z-10">
        {allProjectImages.map((project, i) => (
          <div
            key={i}
            onClick={() => handleProjectClick(project.path, project.index)}
            className="relative h-full overflow-hidden group cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ 
                opacity: 0.6,
                x: ['-100%', '0%'],
                transition: {
                  x: {
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "linear"
                  }
                }
              }}
              whileHover={{ 
                scale: 1.1,
                opacity: 1,
                zIndex: 30,
                transition: { duration: 0.3 }
              }}
              className="h-full"
            >
              {/* Image */}
              <motion.div 
                className="absolute inset-0 transition-all duration-300"
                whileHover={{ scale: 1.15 }}
              >
                <img
                  src={project.image}
                  alt={`Portfolio ${i + 1}`}
                  className="w-full h-full object-cover brightness-[0.7]"
                />
              </motion.div>
              
              {/* Dark overlay */}
              <motion.div 
                className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300 group-hover:opacity-70"
              />

              {/* Project info */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 transition-all duration-300 group-hover:opacity-100"
              >
                <motion.h3
                  className="text-white font-bold text-2xl mb-3 drop-shadow-lg transform translate-y-4 transition-all duration-300 group-hover:translate-y-0"
                >
                  {project.company}
                </motion.h3>
                <motion.p
                  className="text-white text-sm px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm transform translate-y-4 transition-all duration-300 group-hover:translate-y-0"
                >
                  {project.role}
                </motion.p>
              </motion.div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"
              />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60 pointer-events-none z-15" />
    </div>
  );
}

export default AnimatedHeader;