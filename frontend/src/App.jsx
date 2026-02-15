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
import { AuthKitProvider } from '@workos-inc/authkit-react';
import { AuthProvider } from './features/auth';
import PerformanceRoute from './components/PerformanceRoute';
import performanceOptimizer from './utils/performance';
import prefetchManager from './utils/prefetch';

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
const FullGallery = lazy(() => import('./components/FullGallery'));
const Admin = lazy(() => import('./components/Admin'));

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
      import('./components/Awards'),
      import('./components/FullGallery')
    ]);
  }, 500);
};

// Optimized loading fallback component
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-cream-100">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cinnabar-500"></div>
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

  // Always render - components will handle missing data gracefully
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
      
      // Prefetch other routes in background
      prefetchManager.prefetchAllRoutes();
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>
      
      {/* Hide navbar on admin routes */}
      {!location.pathname.startsWith('/admin') && <Navbar />}

      <main className={`flex-grow bg-cream-100 ${location.pathname.startsWith('/admin') ? '' : 'pt-20'}`}>
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
            <Route path="/gallery" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <PerformanceRoute
                    component={FullGallery}
                    section="gallery"
                    routeKey="gallery"
                  >
                    <Footer />
                  </PerformanceRoute>
                </Suspense>
              </PageTransition>
            } />
            <Route path="/admin/*" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <Admin />
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

const workosClientId = import.meta.env.VITE_WORKOS_CLIENT_ID || '';
const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

const AppWrapper = () => (
  <Router>
    <HelmetProvider>
      <AuthKitProvider
        clientId={workosClientId}
        redirectUri={redirectUri}
      >
        <AuthProvider>
          <GlobalDataProvider>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </GlobalDataProvider>
        </AuthProvider>
      </AuthKitProvider>
    </HelmetProvider>
  </Router>
);

export default AppWrapper;
