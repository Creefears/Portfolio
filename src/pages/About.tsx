import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/About/HeroSection';
import { StatsSection } from '../components/About/StatsSection';
import { TimelineSection } from '../components/About/TimelineSection';

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-900"
    >
      <HeroSection />
      <StatsSection />
      <TimelineSection />
    </motion.div>
  );
}

export default About;