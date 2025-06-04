import React from 'react';
import Navbar from './components/layout/Navbar';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main content sections */}
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <section id="about" className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center">About Me</h1>
            {/* About content will go here */}
          </div>
        </section>

        <section id="education" className="min-h-screen flex items-center justify-center bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Education</h2>
            {/* Education content will go here */}
          </div>
        </section>

        <section id="experience" className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Professional Experience</h2>
            {/* Experience content will go here */}
          </div>
        </section>

        <section id="leadership" className="min-h-screen flex items-center justify-center bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Leadership Experience</h2>
            {/* Leadership content will go here */}
          </div>
        </section>

        <section id="projects" className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Projects</h2>
            {/* Projects content will go here */}
          </div>
        </section>

        <section id="awards" className="min-h-screen flex items-center justify-center bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Awards</h2>
            {/* Awards content will go here */}
          </div>
        </section>

        <section id="gallery" className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Gallery</h2>
            {/* Gallery content will go here */}
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Contact</h2>
            {/* Contact content will go here */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
