import React from 'react';

const SectionTitle = ({ children, align = 'left', accent = true }) => {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {accent && (
        <div className={`w-12 h-1 bg-cinnabar-500 mb-4 rounded-full ${align === 'center' ? 'mx-auto' : ''}`} />
      )}
      <h2 className="text-3xl md:text-4xl font-display font-semibold text-cream-800 tracking-tight">
        {children}
      </h2>
    </div>
  );
};

export default SectionTitle;
