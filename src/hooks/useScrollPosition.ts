import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [lastPosition, setLastPosition] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      if (position > lastPosition) {
        setDirection('down');
      } else if (position < lastPosition) {
        setDirection('up');
      }
      
      setLastPosition(position);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [lastPosition]);

  return { scrollPosition, direction };
}