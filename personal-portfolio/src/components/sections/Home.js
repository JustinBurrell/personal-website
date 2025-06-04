import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

const Home = () => {
  return (
    <section id="home" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>Home</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <Card>
            {/* Section specific content */}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Home;