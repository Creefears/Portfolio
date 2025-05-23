import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useCareerStore } from '../../store/careerStore';
import { FloatingKeywords } from './FloatingKeywords';

// Helper function to darken a hex color
const darkenColor = (hex: string, percent: number) => {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Darken each component
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));
  
  // Convert back to hex
  const darkerHex = '#' + 
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0');
  
  return darkerHex;
};

// Helper function to create RGBA color
const toRGBA = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function TimelineSection() {
  const { experiences } = useCareerStore();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Timeline Header with Gradient Border */}
        <div className="relative mb-16">
          {/* Vertical line extension to connect with the timeline */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 hidden md:block"
            style={{
              height: '3rem',
              bottom: '-3rem',
              background: 'linear-gradient(to bottom, rgba(99, 102, 241, 1), rgba(99, 102, 241, 0))'
            }}
          />
          
          {/* Header Container */}
          <div className="relative inline-block left-1/2 transform -translate-x-1/2">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" 
                 style={{ padding: '2px' }}>
              <div className="h-full w-full bg-gray-50 dark:bg-gray-900 rounded-lg" />
            </div>
            <h2 className="relative text-3xl font-bold text-center text-gray-900 dark:text-gray-100 px-8 py-4">
              Mon Parcours
            </h2>
          </div>
        </div>

        {/* Floating Keywords Background */}
        <FloatingKeywords />

        <div className="relative">
          {/* Timeline Container */}
          <div className="relative">
            {/* Timeline Line with gradient fade - Only visible on desktop */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-1 hidden md:block"
              style={{
                height: 'calc(100% - 2rem)',
                top: '1rem',
                background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0), rgba(99, 102, 241, 1) 10%, rgba(99, 102, 241, 1) 90%, rgba(99, 102, 241, 0))'
              }}
            />

            {experiences.map((item, index) => {
              const IconComponent = Icons[item.icon as keyof typeof Icons] || Icons.Briefcase;
              const darkerColor = darkenColor(item.color, 30);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative flex md:items-center mb-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col pl-16 md:pl-0`}
                >
                  {/* Mobile Timeline Line */}
                  <div className="absolute h-full w-1 bg-gradient-to-b from-indigo-500 to-transparent left-8 top-12 md:hidden z-10" />
                  
                  {/* Mobile Timeline Icon */}
                  <div className="absolute left-4 md:hidden z-20 top-0">
                    <motion.div 
                      className="relative w-8 h-8"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div 
                        className="relative w-full h-full rounded-full flex items-center justify-center bg-white dark:bg-gray-800"
                        style={{
                          background: `linear-gradient(135deg, ${item.color} 0%, ${darkerColor} 100%)`,
                          boxShadow: `0 0 20px ${toRGBA(item.color, 0.5)}`
                        }}
                      >
                        <IconComponent className="w-4 h-4 text-white drop-shadow-lg" />
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-left`}>
                    {item.link ? (
                      <Link to={item.link}>
                        <motion.div 
                          className={`group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                            index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                          }`}
                          whileHover={{ y: -5, scale: 1.05 }}
                        >
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-2">
                            {item.year}
                          </span>
                          <div className="mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {item.role}
                            </h3>
                            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                              {item.company}
                            </p>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                          <p className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 group-hover:underline">
                            Voir les projets associés →
                          </p>
                        </motion.div>
                      </Link>
                    ) : (
                      <motion.div 
                        className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                          index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                        }`}
                        whileHover={{ y: -5, scale: 1.05 }}
                      >
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-2">
                          {item.year}
                        </span>
                        <div className="mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {item.role}
                          </h3>
                          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                            {item.company}
                          </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Desktop Timeline Icon */}
                  <div className="absolute md:left-1/2 transform md:-translate-x-1/2 hidden md:flex items-center justify-center z-20">
                    <motion.div 
                      className="relative w-12 h-12"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {/* Neon glow layers */}
                      <div 
                        className="absolute inset-0 rounded-full blur-md"
                        style={{ 
                          background: `linear-gradient(135deg, ${toRGBA(item.color, 0.6)} 0%, ${toRGBA(darkerColor, 0.6)} 100%)`,
                          animation: 'pulse 2s infinite'
                        }} 
                      />
                      <div 
                        className="absolute inset-0 rounded-full blur-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${toRGBA(item.color, 0.8)} 0%, ${toRGBA(darkerColor, 0.8)} 100%)`,
                        }} 
                      />
                      {/* Main icon container */}
                      <div 
                        className="relative w-full h-full rounded-full flex items-center justify-center bg-white dark:bg-gray-800"
                        style={{
                          background: `linear-gradient(135deg, ${item.color} 0%, ${darkerColor} 100%)`,
                          boxShadow: `0 0 20px ${toRGBA(item.color, 0.5)}, inset 0 0 15px ${toRGBA(darkerColor, 0.3)}`
                        }}
                      >
                        <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    </motion.div>
                  </div>
                  <div className="w-full md:w-5/12" />
                </motion.div>
              );
            })}

            {/* Timeline End Point */}
            <div className="relative flex justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 0.6; }
          }
        `}
      </style>
    </section>
  );
}