import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './assets/shared/Navbar';
import Footer from './assets/shared/Footer';
import PageTransition from './assets/shared/PageTransition';
import './App.css';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Education = lazy(() => import('./components/Education'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Awards = lazy(() => import('./components/Awards'));
const Gallery = lazy(() => import('./components/Gallery'));
const Contact = lazy(() => import('./components/Contact'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    // Only handle smooth scrolling for hash changes on home page
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <Home />
        <About />
        <Gallery />
        <Contact />
      </Suspense>
    </div>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Justin Burrell</title>
        <meta name="description" content="With a passion for technology and a knack for problem-solving, I aim to leverage my technical skills, consulting experience, and leadership background to drive innovation and create scalable solutions that make a positive impact." />
        <meta name="keywords" content="Justin Burrell, Software Engineer, Horace Mann, Prep for Prep, All Star Code, Lehigh University, Consulting, Portfolio, Python, Java" />
      </Helmet>
      <Navbar />
      {/* Main content with routes */}
      <main className="relative bg-gray-50">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition>
                <div className="pt-16">
                  <HomePage />
                </div>
              </PageTransition>
            } />
            <Route path="/education" element={
              <PageTransition>
                <div className="pt-16">
                  <Suspense fallback={<LoadingFallback />}>
                    <Education />
                  </Suspense>
                </div>
              </PageTransition>
            } />
            <Route path="/experience" element={
              <PageTransition>
                <div className="pt-16">
                  <Suspense fallback={<LoadingFallback />}>
                    <Experience />
                  </Suspense>
                </div>
              </PageTransition>
            } />
            <Route path="/projects" element={
              <PageTransition>
                <div className="pt-16">
                  <Suspense fallback={<LoadingFallback />}>
                    <Projects />
                  </Suspense>
                </div>
              </PageTransition>
            } />
            <Route path="/awards" element={
              <PageTransition>
                <div className="pt-16">
                  <Suspense fallback={<LoadingFallback />}>
                    <Awards />
                  </Suspense>
                </div>
              </PageTransition>
            } />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

// Wrap the entire app with Router and HelmetProvider
const AppWrapper = () => (
  <Router>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Router>
);

export default AppWrapper;
