import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';

const Gallery = () => {
  const { gallery } = portfolioData;

  return (
    <AnimationWrapper>
      <section id="gallery" className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  {item.category && (
                    <span className="mt-2 inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Gallery;