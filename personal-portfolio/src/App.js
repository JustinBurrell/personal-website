import React from 'react';
import Navbar from './components/layout/Navbar';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Education from './components/sections/Education';
import Experience from './components/sections/Experience';
import Organizations from './components/sections/Organizations';
import Projects from './components/sections/Projects';
import Awards from './components/sections/Awards';
import Gallery from './components/sections/Gallery';
import Contact from './components/sections/Contact';
import portfolioData from './data/portfolioData.ts';
import './App.css';

function App() {
  const sections = [
    { Component: Home, id: 'home' },
    { Component: About, id: 'about' },
    { Component: Education, id: 'education' },
    { Component: Organizations, id: 'organizations' },
    { Component: Experience, id: 'experience' },
    { Component: Projects, id: 'projects' },
    { Component: Awards, id: 'awards' },
    { Component: Gallery, id: 'gallery' },
    { Component: Contact, id: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Main content sections */}
      <main className="pt-16"> {/* Padding top for fixed navbar */}
        {sections.map(({ Component, id }) => (
          <Component key={id} />
        ))}
      </main>
    </div>
  );
}

export default App;
