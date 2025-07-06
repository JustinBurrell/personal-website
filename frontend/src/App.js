import React, { useEffect, Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './assets/shared/Navbar';
import Footer from './assets/shared/Footer';
import PageTransition from './assets/shared/PageTransition';
import CustomCursor from './assets/shared/CustomCursor';
import ContentLoader from './assets/shared/ContentLoader';
import { LanguageProvider, useLanguage } from './features/language';
import { GlobalDataProvider, useGlobalData } from './hooks/useGlobalData';
import PerformanceRoute from './components/PerformanceRoute';
import performanceOptimizer from './utils/performance';

import './App.css';

// Lazy load components with better chunking and preloading
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Education = lazy(() => import('./components/Education'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Awards = lazy(() => import('./components/Awards'));
const Gallery = lazy(() => import('./components/Gallery'));
const Contact = lazy(() => import('./components/Contact'));

// Aggressive preloading strategy
const preloadComponents = () => {
  // Immediate preload of critical components
  Promise.all([
    import('./components/About'),
    import('./components/Gallery'),
    import('./components/Contact')
  ]);
  
  // Preload other components after a short delay
  setTimeout(() => {
    Promise.all([
      import('./components/Education'),
      import('./components/Experience'),
      import('./components/Projects'),
      import('./components/Awards')
    ]);
  }, 500);
};

// Optimized loading fallback component
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
));

// Memoized HomePage component
const HomePage = memo(() => {
  const { hash } = useLocation();
  const { translatedData, isLoading } = useLanguage();

  useEffect(() => {
    performanceOptimizer.startRouteLoad('home');
    
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // Aggressive preloading
    preloadComponents();
  }, [hash]);

  // Show loading state if data is not available yet
  if (isLoading || !translatedData) {
    return <LoadingFallback />;
  }

  return (
    <ContentLoader data={translatedData} routeKey="home">
      <Suspense fallback={<LoadingFallback />}>
        <Home />
        <About />
        <Gallery />
        <Contact />
      </Suspense>
      <Footer />
    </ContentLoader>
  );
});

// Main App component with conditional navbar
const App = memo(() => {
  const location = useLocation();
  const { isInitialLoad } = useGlobalData();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Start performance monitoring for route changes
    if (location.pathname !== '/') {
      const routeKey = location.pathname.slice(1);
      performanceOptimizer.startRouteLoad(routeKey);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      <Helmet>
        <title>Justin Burrell | Software Engineer and Tech Consultant</title>
        <meta name="description" content="With a passion for technology and a knack for problem-solving, I aim to leverage my technical skills, consulting experience, and leadership background to drive innovation and create scalable solutions that make a positive impact." />
        <meta name="keywords" content="Justin Burrell, thejustinburrell.com, Justin Burrell portfolio website, Justin Burrell Lehigh, Justin Burrell Computer Science, Justin Burrell CSE, Lehigh University Computer Science, Lehigh CSE, Lehigh University Class of 2026, Software Engineer, Horace Mann, Prep for Prep, All Star Code, Lehigh University, Consulting, Portfolio, Python, Java, Kappa Alpha Psi, Kappa" />
        
        {/* Aggressive preloading for critical resources */}
        <link rel="preload" href="/assets/images/home/FLOC Headshot.jpeg" as="image" />
        <link rel="preload" href="/assets/images/about/About Background Photo.jpg" as="image" />
        <link rel="preload" href="/assets/images/gallery/Gallery Background Photo.jpg" as="image" />
        
        {/* Preload critical fonts */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      {/* Only show navbar after initial load */}
      {!isInitialLoad && <Navbar />}
      
      <main className={`flex-grow bg-gray-50 ${!isInitialLoad ? 'pt-16' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            } />
            <Route path="/education" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <PerformanceRoute 
                    component={Education} 
                    section="education" 
                    routeKey="education" 
                  >
                    <Footer />
                  </PerformanceRoute>
                </Suspense>
              </PageTransition>
            } />
            <Route path="/experience" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <PerformanceRoute 
                    component={Experience} 
                    section="experience" 
                    routeKey="experience" 
                  >
                    <Footer />
                  </PerformanceRoute>
                </Suspense>
              </PageTransition>
            } />
            <Route path="/projects" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <PerformanceRoute 
                    component={Projects} 
                    section="projects" 
                    routeKey="projects" 
                  >
                    <Footer />
                  </PerformanceRoute>
                </Suspense>
              </PageTransition>
            } />
            <Route path="/awards" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <PerformanceRoute 
                    component={Awards} 
                    section="awards" 
                    routeKey="awards" 
                  >
                    <Footer />
                  </PerformanceRoute>
                </Suspense>
              </PageTransition>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
});

const AppWrapper = () => (
  <Router>
    <HelmetProvider>
      <GlobalDataProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </GlobalDataProvider>
    </HelmetProvider>
  </Router>
);

export default AppWrapper;
