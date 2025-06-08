import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './assets/shared/Navbar';
import PageTransition from './assets/shared/PageTransition';
import Home from './components/Home';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Awards from './components/Awards';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import './App.css';

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
      <Home />
      <About />
      <Gallery />
      <Contact />
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Main content with routes */}
      <main className="pt-16"> {/* Padding top for fixed navbar */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <TransitionWrapper>
                <HomePage />
              </TransitionWrapper>
            } />
            <Route path="/education" element={
              <TransitionWrapper>
                <Education />
              </TransitionWrapper>
            } />
            <Route path="/experience" element={
              <TransitionWrapper>
                <Experience />
              </TransitionWrapper>
            } />
            <Route path="/projects" element={
              <TransitionWrapper>
                <Projects />
              </TransitionWrapper>
            } />
            <Route path="/awards" element={
              <TransitionWrapper>
                <Awards />
              </TransitionWrapper>
            } />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
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
