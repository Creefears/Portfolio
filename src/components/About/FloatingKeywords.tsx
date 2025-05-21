import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingKeywordProps {
  text: string;
  position: { x: number; y: number };
}

const keywords = [
  "Innovant",
  "Adaptabilité",
  "Flexible",
  "Polyvalent",
  "Appliqué",
  "Créatif",
  "Passionné",
  "Rigoureux",
  "Leadership",
  "Communication",
  "Organisation",
  "Autonomie",
  "Esprit d'équipe",
  "Problem Solver",
  "Curieux",
  "Dynamique",
  "Persévérant",
  "Méthodique",
  "Proactif",
  "\"Couteau suisse\""
];

const FloatingKeyword = ({ text, position }: FloatingKeywordProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{
      opacity: [0, 0.65, 0.65, 0],
      scale: [0.5, 1, 1, 0.8],
      y: [position.y, position.y - 100]
    }}
    transition={{
      duration: 4,
      times: [0, 0.1, 0.9, 1],
      ease: "easeInOut"
    }}
    className="absolute text-2xl md:text-4xl font-bold pointer-events-none select-none"
    style={{
      left: position.x,
      background: 'linear-gradient(to right, #6366f1, #a855f7)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))',
    }}
  >
    {text}
  </motion.div>
);

export function FloatingKeywords() {
  const [keywords2, setKeywords2] = useState<Array<{ id: number; text: string; position: { x: number; y: number } }>>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const timelineSection = document.querySelector('section.py-20.relative');
      if (timelineSection) {
        const rect = timelineSection.getBoundingClientRect();
        const x = Math.random() * (rect.width - 200);
        const y = Math.random() * (rect.height - 100);
        
        setKeywords2(prev => [...prev, {
          id: count,
          text: keywords[Math.floor(Math.random() * keywords.length)],
          position: { x, y }
        }]);
        setCount(c => c + 1);

        setTimeout(() => {
          setKeywords2(prev => prev.filter(k => k.id !== count));
        }, 4000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {keywords2.map(({ id, text, position }) => (
          <FloatingKeyword key={id} text={text} position={position} />
        ))}
      </AnimatePresence>
    </div>
  );
}