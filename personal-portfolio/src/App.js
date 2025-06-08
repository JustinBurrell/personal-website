import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Education from './components/sections/Education';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Awards from './components/sections/Awards';
import Gallery from './components/sections/Gallery';
import Contact from './components/sections/Contact';
import portfolioData from './data/portfolioData.ts';
import './App.css';

function HomePage() {
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
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* Main content with routes */}
        <main className="pt-16"> {/* Padding top for fixed navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/education" element={<Education />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/awards" element={<Awards />} />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
