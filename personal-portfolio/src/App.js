import React from 'react';
import Navbar from './components/layout/Navbar';
import About from './components/sections/About';
import Education from './components/sections/Education';
import Experience from './components/sections/Experience';
import Organizations from './components/sections/Organizations';
import Projects from './components/sections/Projects';
import Awards from './components/sections/Awards';
import Gallery from './components/sections/Gallery';
import Contact from './components/sections/Contact';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main content sections */}
      <main className="pt-16"> {/* Padding top for fixed navbar */}
        <About />
        <Education />
        <Experience />
        <Organizations />
        <Projects />
        <Awards />
        <Gallery />
        <Contact />
      </main>
    </div>
  );
}

export default App;
