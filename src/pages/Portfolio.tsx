import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function Portfolio() {
  // Move all hook calls to the top of the component
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGyroAvailable, setIsGyroAvailable] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Framer Motion hooks
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [25, -25]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-25, 25]), springConfig);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof navigator !== 'undefined') {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
      }
    };
    checkMobile();

    const setupGyroscope = () => {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.beta !== null && event.gamma !== null) {
          // Adjust for typical phone holding angle (70-90 degrees)
          const normalizedBeta = Math.max(-0.5, Math.min(0.5, (event.beta - 80) / 30));
          const normalizedGamma = Math.max(-0.5, Math.min(0.5, event.gamma / 30));
          
          // Apply smoothing and increased sensitivity
          const sensitivity = 2.0;
          x.set(normalizedGamma * sensitivity);
          y.set(normalizedBeta * sensitivity);
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
      }
      return () => {};
    };

    const requestGyroPermission = async () => {
      if (isMobile && typeof window !== 'undefined' && typeof DeviceOrientationEvent !== 'undefined') {
        try {
          if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission === 'granted') {
              setIsGyroAvailable(true);
              setupGyroscope();
            }
          } else {
            setIsGyroAvailable(true);
            setupGyroscope();
          }
        } catch (error) {
          console.error('Error requesting gyroscope permission:', error);
        }
      }
    };

    requestGyroPermission();
  }, [isMobile, x, y]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (event.clientY - rect.top) / rect.height - 0.5;
      
      x.set(mouseX);
      y.set(mouseY);
      setMousePosition({ x: mouseX, y: mouseY });
    }
  };

  const handleTouchStart = () => {
    setIsTouchActive(true);
    if (isMobile && !isGyroAvailable && typeof window !== 'undefined' && typeof DeviceOrientationEvent !== 'undefined') {
      const requestPermission = async () => {
        try {
          if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission === 'granted') {
              setIsGyroAvailable(true);
            }
          }
        } catch (error) {
          console.error('Error requesting permission:', error);
        }
      };
      requestPermission();
    }
  };

  const handleTouchEnd = () => {
    setIsTouchActive(false);
  };

  const categories = [
    {
      title: "CGI",
      description: "Découvrez mes projets en 3D et animation",
      link: "/cgi"
    },
    {
      title: "RÉEL",
      description: "Explorez mes réalisations audiovisuelles",
      link: "/prise-de-vue-reel"
    }
  ];

  return (
    <div className="pt-16">
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            Portfolio
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {categories.map((category, index) => (
              <Link key={index} to={category.link}>
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  onMouseMove={handleMouseMove}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      x.set(0);
                      y.set(0);
                      setMousePosition({ x: 0, y: 0 });
                    }
                  }}
                  className="relative h-[28rem] rounded-xl overflow-hidden shadow-xl cursor-pointer bg-black perspective-1000"
                >
                  {category.title === "CGI" && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-[#232323]">
                        <div className="absolute inset-0" 
                             style={{
                               backgroundImage: `
                                 linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                               `,
                               backgroundSize: '20px 20px'
                             }}
                        />
                        <div className="absolute inset-0" 
                             style={{
                               backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                               backgroundSize: '20px 20px'
                             }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {category.title === "RÉEL" && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      variants={{
                        initial: { opacity: 0 },
                        hover: { opacity: 1 }
                      }}
                      animate={isTouchActive ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="absolute inset-0" 
                           style={{
                             background: `
                               radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 30%),
                               radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 30%)
                             `
                           }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[200%] aspect-square rounded-full"
                             style={{
                               background: 'radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 70%)',
                               border: '100px solid rgba(255,255,255,0.1)',
                               backdropFilter: 'blur(8px)'
                             }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      rotateX: category.title === "CGI" ? rotateX : 0,
                      rotateY: category.title === "CGI" ? rotateY : 0,
                      transformStyle: "preserve-3d",
                      perspective: "1000px"
                    }}
                  >
                    <motion.div
                      className="relative"
                      style={{
                        transform: category.title === "CGI" ? "translateZ(80px)" : "none",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {category.title === "CGI" ? (
                        <div className="relative">
                          {/* Front face */}
                          <motion.h2 
                            className="text-[8rem] md:text-[8rem] font-black text-[#94c8ff] mix-blend-screen relative"
                            style={{
                              textShadow: "0 0 30px rgba(148,200,255,0.6)",
                              WebkitTextStroke: "2px rgba(148,200,255,0.8)",
                              transform: "translateZ(40px)",
                              transformStyle: "preserve-3d"
                            }}
                          >
                            CGI
                          </motion.h2>
                          
                          {/* Side faces for depth */}
                          <motion.h2
                            className="text-[8rem] md:text-[8rem] font-black absolute top-0 left-0 text-[#4a90e2] opacity-50"
                            style={{
                              transform: "translateZ(20px) translateX(-4px)",
                              WebkitTextStroke: "2px rgba(74,144,226,0.4)"
                            }}
                          >
                            CGI
                          </motion.h2>
                          
                          <motion.h2
                            className="text-[8rem] md:text-[8rem] font-black absolute top-0 left-0 text-[#2563eb] opacity-30"
                            style={{
                              transform: "translateZ(0px) translateX(-8px)",
                              WebkitTextStroke: "2px rgba(37,99,235,0.3)"
                            }}
                          >
                            CGI
                          </motion.h2>
                          
                          {/* Glow layers */}
                          {[...Array(6)].map((_, i) => (
                            <motion.h2
                              key={i}
                              className="text-[8rem] md:text-[8rem] font-black absolute top-0 left-0 pointer-events-none"
                              style={{
                                color: `rgba(148,200,255,${0.15 - i * 0.02})`,
                                transform: `translateZ(${-(i * 10)}px)`,
                                filter: `blur(${i * 1}px)`,
                                transformStyle: "preserve-3d"
                              }}
                            >
                              CGI
                            </motion.h2>
                          ))}
                        </div>
                      ) : (
                        <motion.h2 
                          className="text-[5rem] sm:text-[6rem] md:text-[8rem] font-black text-white mix-blend-difference"
                          variants={{
                            initial: { scale: 1, filter: "brightness(0.8)" },
                            hover: { 
                              scale: 1.05,
                              filter: "brightness(1.2)",
                              textShadow: "0 0 20px rgba(255,255,255,0.5)"
                            }
                          }}
                          animate={isTouchActive ? {
                            scale: 1.05,
                            filter: "brightness(1.2)",
                            textShadow: "0 0 20px rgba(255,255,255,0.5)"
                          } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          {category.title}
                        </motion.h2>
                      )}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="absolute inset-x-0 bottom-0 p-8 flex justify-center"
                    style={{
                      transform: category.title === "CGI" ? "translateZ(50px)" : "none"
                    }}
                    variants={{
                      initial: { y: 20, opacity: 0 },
                      hover: { y: 0, opacity: 1 }
                    }}
                    animate={isTouchActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="text-white text-lg font-medium bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm">
                      {category.description}
                    </span>
                  </motion.div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;