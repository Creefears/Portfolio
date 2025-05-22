import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { useProjectStore } from './store/projectStore';
import { useCareerStore } from './store/careerStore';
import { AnimatePresence, LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const About = lazy(() => import('./pages/About'));
const CGI = lazy(() => import('./pages/CGI'));
const RealFootage = lazy(() => import('./pages/RealFootage'));
const BuyGold = lazy(() => import('./pages/BuyGold'));

// Title updater component
function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const titles: { [key: string]: string } = {
      '/': 'Victor Jacob - Portfolio',
      '/portfolio': 'Portfolio | Victor Jacob',
      '/a-propos': 'À Propos | Victor Jacob',
      '/cgi': 'CGI & Animation 3D | Victor Jacob',
      '/prise-de-vue-reel': 'Prise de Vue Réel | Victor Jacob',
      '/mentions-legales': 'Mentions Légales | Victor Jacob',
      '/politique-confidentialite': 'Politique de Confidentialité | Victor Jacob',
      '/buy-gold': 'Administration | Victor Jacob'
    };

    document.title = titles[location.pathname] || 'Victor Jacob - Portfolio';
    
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion="user">
          <AppContent />
        </MotionConfig>
      </LazyMotion>
    </Router>
  );
}

function AppContent() {
  const { isDarkMode } = useThemeStore();
  const { fetchProjects } = useProjectStore();
  const { fetchExperiences } = useCareerStore();
  const location = useLocation();

  useEffect(() => {
    // Fetch data on app initialization
    fetchProjects();
    fetchExperiences();
  }, [fetchProjects, fetchExperiences]);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 flex-grow">
        <TitleUpdater />
        <Navbar />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/cgi" element={<CGI />} />
                <Route path="/prise-de-vue-reel" element={<RealFootage />} />
                <Route path="/buy-gold" element={<BuyGold />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        <ThemeToggle />
        <Footer />
      </div>
    </div>
  );
}

export default App;