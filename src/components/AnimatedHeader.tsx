import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';

function AnimatedHeader() {
  const { userCGIProjects, userRealProjects } = useProjectStore();
  const [loopedProjects, setLoopedProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Combine and format projects
    const projects = [
      ...userCGIProjects.map(p => ({
        ...p,
        path: '/cgi',
        company: p.title,
        index: userCGIProjects.indexOf(p)
      })),
      ...userRealProjects.map(p => ({
        ...p,
        path: '/prise-de-vue-reel',
        company: p.title,
        index: userRealProjects.indexOf(p)
      }))
    ];
    
    // Double the array for infinite loop effect
    setLoopedProjects([...projects, ...projects]);
  }, [userCGIProjects, userRealProjects]);

  const handleProjectClick = (path: string, index: number) => {
    navigate(`${path}?project=${index}`);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-900">
      {/* Background grid of images */}
      <div className="absolute inset-0 flex gap-4 animate-scroll">
        <motion.div
          className="flex gap-4 shrink-0"
          animate={{ 
            x: [0, '-100%']
          }}
          transition={{
            duration: 60,
            ease: 'linear',
            repeat: Infinity
          }}
        >
          {loopedProjects.map((project, i) => (
            <motion.div
              key={i}
              onClick={() => handleProjectClick(project.path, project.index)}
              className="relative w-[300px] h-[200px] overflow-hidden cursor-pointer group"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="absolute inset-0 transition-all duration-300"
                whileHover={{ scale: 1.15 }}
              >
                <img
                  src={project.image}
                  alt={project.company}
                  className="w-full h-full object-cover brightness-[0.7]"
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

              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300"
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
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex gap-4 shrink-0"
          animate={{ 
            x: [0, '-100%']
          }}
          transition={{
            duration: 60,
            ease: 'linear',
            repeat: Infinity
          }}
        >
          {loopedProjects.map((project, i) => (
            <motion.div
              key={`duplicate-${i}`}
              onClick={() => handleProjectClick(project.path, project.index)}
              className="relative w-[300px] h-[200px] overflow-hidden cursor-pointer group"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="absolute inset-0 transition-all duration-300"
                whileHover={{ scale: 1.15 }}
              >
                <img
                  src={project.image}
                  alt={project.company}
                  className="w-full h-full object-cover brightness-[0.7]"
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

              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300"
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