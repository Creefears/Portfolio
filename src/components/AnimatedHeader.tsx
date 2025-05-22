import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';

function AnimatedHeader() {
  const navigate = useNavigate();
  const { userCGIProjects, userRealProjects } = useProjectStore();
  const controls = useAnimation();

  // Combine all projects and get their images
  const allProjects = [...userCGIProjects, ...userRealProjects];
  const projectImages = allProjects.map(project => ({
    image: project.image,
    role: project.role,
    company: project.company,
    path: project.type?.toLowerCase() === 'cgi' ? '/cgi' : '/prise-de-vue-reel',
    index: project.type?.toLowerCase() === 'cgi' 
      ? userCGIProjects.findIndex(p => p.id === project.id)
      : userRealProjects.findIndex(p => p.id === project.id)
  }));

  // Duplicate images to create seamless loop
  const duplicatedImages = [...projectImages, ...projectImages];

  useEffect(() => {
    const startAnimation = async () => {
      await controls.start({
        x: [0, -50 * projectImages.length], // Move by total width of original images
        transition: {
          duration: projectImages.length * 10, // Duration based on number of images
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    };

    startAnimation();
  }, [controls, projectImages.length]);

  const handleProjectClick = (path: string, index: number) => {
    navigate(`${path}?project=${index}`);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-900">
      {/* Background grid of images */}
      <motion.div 
        animate={controls}
        className="absolute inset-0 flex transform -rotate-12 scale-[1.4] translate-y-[-5%] z-10"
        style={{ width: `${duplicatedImages.length * 50}%` }} // Make container wide enough for all images
      >
        {duplicatedImages.map((project, i) => (
          <motion.div
            key={i}
            className="relative h-full overflow-hidden cursor-pointer"
            style={{ width: '25%' }} // Each image takes 25% of viewport width
            initial={{ opacity: 0.8 }}
            whileHover={{ 
              scale: 1.1, 
              zIndex: 10,
              opacity: 1,
              transition: { duration: 0.3 }
            }}
            onClick={() => handleProjectClick(project.path, project.index)}
          >
            <motion.div 
              className="absolute inset-0 transition-all duration-300"
              whileHover={{ scale: 1.15 }}
            >
              <motion.img
                src={project.image}
                alt={`Portfolio ${i + 1}`}
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
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60 pointer-events-none z-15" />
    </div>
  );
}

export default AnimatedHeader;