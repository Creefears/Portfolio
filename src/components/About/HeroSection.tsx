import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const profileImage = "https://i.imgur.com/f9X3Y7v.jpg";

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden mt-16">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mix-blend-multiply" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <img 
                src="VJ Icon.ico"
                alt="VJ Logo"
                className="w-12 h-12"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Victor Jacob
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Lead Artist 3D & Spécialiste en Animation
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Passionné par l'audiovisuel et les nouvelles technologies, je crée des expériences visuelles 
              uniques en combinant animation 3D et production vidéo traditionnelle.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="mailto:vics.jacob@gmail.com"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors"
              >
                Me contacter
              </a>
              <Link
                to="/portfolio"
                className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-full transition-colors"
              >
                Voir mon portfolio
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse" 
                   style={{ filter: 'blur(40px)' }} />
              <img
                src={profileImage}
                alt="Victor Jacob"
                className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-2xl"
                style={{ objectPosition: "center 15%" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}