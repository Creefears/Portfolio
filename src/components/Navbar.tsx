import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleModalStateChange = (e: CustomEvent) => {
      setIsModalOpen(e.detail.isOpen);
    };

    window.addEventListener('modalStateChange' as any, handleModalStateChange);
    return () => window.removeEventListener('modalStateChange' as any, handleModalStateChange);
  }, []);

  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('navbar.home') },
    { path: '/portfolio', label: t('navbar.portfolio') },
    { path: '/a-propos', label: t('navbar.about') }
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const isHomePage = location.pathname === '/';

  const getNavBackground = () => {
    if (isModalOpen) {
      return 'bg-black/40 backdrop-blur-md';
    }

    if (isScrolled) {
      return isHomePage 
        ? 'bg-black/40 backdrop-blur-md' 
        : 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg';
    }

    if (!isHomePage) {
      return 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm';
    }

    return 'bg-transparent';
  };

  const getTextColor = () => {
    if (isModalOpen || (isHomePage && !isScrolled)) {
      return 'text-white';
    }
    return 'text-gray-900 dark:text-white';
  };

  const getLinkColor = () => {
    if (isModalOpen || (isHomePage && !isScrolled)) {
      return 'text-gray-100 hover:text-white';
    }
    return 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white';
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${getNavBackground()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex-shrink-0"
            initial={false}
            animate={{ scale: isScrolled ? 0.9 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              to="/" 
              className={`text-xl font-semibold transition-all duration-300 ${getTextColor()}`}
            >
              <motion.span
                initial={false}
                animate={{ 
                  fontSize: isScrolled ? '1.25rem' : '1.5rem',
                  opacity: 1 
                }}
                transition={{ duration: 0.3 }}
              >
                {isScrolled ? 'VJ' : 'Victor Jacob'}
              </motion.span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors group ${getLinkColor()}`}
                >
                  {item.label}
                  <motion.div
                    initial={false}
                    animate={{
                      width: isActive ? '100%' : '0%',
                      opacity: isActive ? 1 : 0
                    }}
                    className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 rounded-full"
                  />
                  <motion.div
                    initial={false}
                    whileHover={{ width: '100%', opacity: 1 }}
                    className="absolute bottom-0 left-0 h-0.5 bg-indigo-400 rounded-full w-0 opacity-0 transition-all duration-300"
                  />
                </Link>
              );
            })}
            <LanguageToggle />
          </div>

          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${getLinkColor()}`}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-indigo-600 hover:text-white dark:text-gray-300'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="px-3 py-2">
                <LanguageToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;