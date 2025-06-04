import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

const Gallery = () => {
  return (
    <section id="gallery" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>Gallery</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <Card>
            {/* Section specific content */}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Gallery;