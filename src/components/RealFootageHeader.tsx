import React from 'react';
import { motion } from 'framer-motion';

const images = [
  "https://i.imgur.com/nvlr9T3.jpg",  // Sarenza
  "https://i.imgur.com/0RunzIX.jpg",  // Nobodies
  "https://i.imgur.com/7upuHV4.jpg",  // It's Jack
  "https://i.imgur.com/ohaBOrG.jpg",  // Timelapse Go
  "https://i.imgur.com/isL0Oc3.jpg",  // Pratiks
  "https://i.imgur.com/LTPbXZQ.jpg",  // Madness
  "https://i.imgur.com/V00RlDs.jpg",  // Creefears
  "https://i.imgur.com/qS47mep.jpg"   // Additional image
];

function RealFootageHeader() {
  return (
    <div className="relative h-[50vh] overflow-hidden bg-gray-900">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-1 transform -rotate-12 scale-[1.2] translate-y-[-5%]">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative h-full overflow-hidden cursor-pointer"
            initial={{ opacity: 0.8 }}
            whileHover={{ 
              scale: 1.1, 
              zIndex: 10,
              opacity: 1,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="absolute inset-0 transition-all duration-300"
              whileHover={{ scale: 1.15 }}
            >
              <motion.img
                src={image}
                alt={`Real Footage Project ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
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
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none">
        <motion.div 
          className="h-full flex items-center justify-start px-8 md:px-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="max-w-2xl">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Projets Prise de Vue Réel
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Production Audiovisuelle et Réalisation
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RealFootageHeader;