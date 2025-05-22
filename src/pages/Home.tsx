import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedHeader from '../components/AnimatedHeader';

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div className="relative min-h-screen pt-16">
        <AnimatedHeader />
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center space-y-12"
            >
              <div className="relative inline-block">
                <motion.h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Victor Jacob
                </motion.h1>
                <motion.div
                  className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />
              </div>
              
              <motion.h2 
                className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                Spécialiste en animation 3D et création audiovisuelle
              </motion.h2>
              
              <motion.p 
                className="text-base md:text-lg lg:text-xl text-gray-200 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                Passionné par l'audiovisuel et les nouvelles technologies, je crée des expériences visuelles uniques 
                en combinant animation 3D et production vidéo traditionnelle.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-6 pointer-events-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                <Link
                  to="/portfolio"
                  className="group relative px-10 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] overflow-hidden"
                >
                  <span className="relative z-10">Découvrir mes projets</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_50%)] transition-opacity duration-300" />
                </Link>
                <Link
                  to="/a-propos"
                  className="group relative px-10 py-4 text-lg font-semibold border-2 border-white text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] overflow-hidden"
                >
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">
                    En savoir plus
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.4),transparent_50%)] transition-opacity duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;