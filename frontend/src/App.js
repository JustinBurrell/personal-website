import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './assets/shared/Navbar';
import Footer from './assets/shared/Footer';
import PageTransition from './assets/shared/PageTransition';
import CustomCursor from './assets/shared/CustomCursor';
import ContentLoader from './assets/shared/ContentLoader';
import { LanguageProvider, useLanguage } from './features/language';
import { PortfolioDataProvider } from './components/PortfolioDataProvider';
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

// Wrapper component for routes that need content loading
const RouteWithContentLoader = ({ component: Component, data, routeKey }) => {
  const { translatedData } = useLanguage();
  const routeData = data ? translatedData[data] : translatedData;

  return (
    <ContentLoader data={routeData} routeKey={routeKey}>
      <Component />
    </ContentLoader>
  );
};

function HomePage() {
  const { hash } = useLocation();
  const { translatedData } = useLanguage();

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
                  <RouteWithContentLoader 
                    component={Education} 
                    data="education" 
                    routeKey="education" 
                  />
                  <Footer />
                </Suspense>
              </PageTransition>
            } />
            <Route path="/experience" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <RouteWithContentLoader 
                    component={Experience} 
                    data="experience" 
                    routeKey="experience" 
                  />
                  <Footer />
                </Suspense>
              </PageTransition>
            } />
            <Route path="/projects" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <RouteWithContentLoader 
                    component={Projects} 
                    data="projects" 
                    routeKey="projects" 
                  />
                  <Footer />
                </Suspense>
              </PageTransition>
            } />
            <Route path="/awards" element={
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <RouteWithContentLoader 
                    component={Awards} 
                    data="awards" 
                    routeKey="awards" 
                  />
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
        <PortfolioDataProvider>
          <App />
        </PortfolioDataProvider>
      </LanguageProvider>
    </HelmetProvider>
  </Router>
);

export default AppWrapper;
