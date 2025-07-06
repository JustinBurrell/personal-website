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
import { GlobalDataProvider } from './hooks/useGlobalData';
import PerformanceRoute from './components/PerformanceRoute';

import './App.css';

// Performance monitoring
const performanceMonitor = {
  startTime: Date.now(),
  routeLoadTimes: {},
  
  startRouteLoad(route) {
    this.routeLoadTimes[route] = Date.now();
  },
  
  endRouteLoad(route) {
    if (this.routeLoadTimes[route]) {
      const loadTime = Date.now() - this.routeLoadTimes[route];
      console.log(`🚀 ${route} loaded in ${loadTime}ms`);
      
      // Track slow loads
      if (loadTime > 2000) {
        console.warn(`⚠️ Slow load detected: ${route} took ${loadTime}ms`);
      }
    }
  }
};

// Lazy load components with better chunking and preloading
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Education = lazy(() => import('./components/Education'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Awards = lazy(() => import('./components/Awards'));
const Gallery = lazy(() => import('./components/Gallery'));
const Contact = lazy(() => import('./components/Contact'));

// Preload critical components
const preloadComponents = () => {
  // Preload components after initial load
  setTimeout(() => {
    import('./components/About');
    import('./components/Gallery');
  }, 1000);
  
  // Preload other components after a delay
  setTimeout(() => {
    import('./components/Education');
    import('./components/Experience');
    import('./components/Projects');
    import('./components/Awards');
  }, 2000);
};

// Optimized loading fallback component
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
));



// Memoized HomePage component
const HomePage = memo(() => {
  const { hash } = useLocation();
  const { translatedData, isLoading } = useLanguage();

  useEffect(() => {
    performanceMonitor.startRouteLoad('home');
    
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // Preload other components
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

// Memoized App component
const App = memo(() => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Start performance monitoring for route changes
    if (location.pathname !== '/') {
      const routeKey = location.pathname.slice(1);
      performanceMonitor.startRouteLoad(routeKey);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      <Helmet>
        <title>Justin Burrell</title>
        <meta name="description" content="With a passion for technology and a knack for problem-solving, I aim to leverage my technical skills, consulting experience, and leadership background to drive innovation and create scalable solutions that make a positive impact." />
        <meta name="keywords" content="Justin Burrell, thejustinburrell.com, Justin Burrell portfolio website, Justin Burrell Lehigh, Justin Burrell Computer Science, Justin Burrell CSE, Lehigh University Computer Science, Lehigh CSE, Lehigh University Class of 2026, Software Engineer, Horace Mann, Prep for Prep, All Star Code, Lehigh University, Consulting, Portfolio, Python, Java, Kappa Alpha Psi, Kappa" />
        {/* Preload critical resources */}
        <link rel="preload" href="/assets/images/home/FLOC Headshot.jpeg" as="image" />
        <link rel="preload" href="/assets/images/about/About Background Photo.jpg" as="image" />
      </Helmet>
      <Navbar />
      <main className="flex-grow pt-16 bg-gray-50">
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
