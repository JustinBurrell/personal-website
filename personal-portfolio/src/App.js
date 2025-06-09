import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './assets/shared/Navbar';
import Footer from './assets/shared/Footer';
import PageTransition from './assets/shared/PageTransition';
import CustomCursor from './assets/shared/CustomCursor';
import { LanguageProvider } from './features/language';
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
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Home />
        <About />
        <Gallery />
        <Contact />
      </Suspense>
      <Footer />
    </>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      <Helmet>
        <title>Justin Burrell</title>
        <meta name="description" content="With a passion for technology and a knack for problem-solving, I aim to leverage my technical skills, consulting experience, and leadership background to drive innovation and create scalable solutions that make a positive impact." />
        <meta name="keywords" content="Justin Burrell, thejustinburrell.com, Justin Burrell portfolio website, Justin Burrell Lehigh, Justin Burrell Computer Science, Justin Burrell CSE, Lehigh University Computer Science, Lehigh CSE, Lehigh University Class of 2026, Software Engineer, Horace Mann, Prep for Prep, All Star Code, Lehigh University, Consulting, Portfolio, Python, Java, Kappa Alpha Psi, Kappa" />
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
                  <Education />
                  <Footer />
                </Suspense>
              </PageTransition>
            } />
            <Route path="/experience" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <Experience />
                  <Footer />
                </Suspense>
              </PageTransition>
            } />
            <Route path="/projects" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <Projects />
                  <Footer />
                </Suspense>
              </PageTransition>
            } />
            <Route path="/awards" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <Awards />
                  <Footer />
                </Suspense>
              </PageTransition>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <HelmetProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HelmetProvider>
  </Router>
);

export default AppWrapper;
