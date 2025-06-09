import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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

// Wrap each page component with PageTransition
const TransitionWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
};

function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* Main content with routes */}
      <main className="pt-16 flex-grow"> {/* Added flex-grow */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <TransitionWrapper>
                <HomePage />
              </TransitionWrapper>
            } />
            <Route path="/education" element={
              <TransitionWrapper>
                <Suspense fallback={<LoadingFallback />}>
                  <Education />
                </Suspense>
              </TransitionWrapper>
            } />
            <Route path="/experience" element={
              <TransitionWrapper>
                <Suspense fallback={<LoadingFallback />}>
                  <Experience />
                </Suspense>
              </TransitionWrapper>
            } />
            <Route path="/projects" element={
              <TransitionWrapper>
                <Suspense fallback={<LoadingFallback />}>
                  <Projects />
                </Suspense>
              </TransitionWrapper>
            } />
            <Route path="/awards" element={
              <TransitionWrapper>
                <Suspense fallback={<LoadingFallback />}>
                  <Awards />
                </Suspense>
              </TransitionWrapper>
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

// Wrap the entire app with Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
