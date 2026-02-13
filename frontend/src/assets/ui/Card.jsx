import React from 'react';

const Card = ({ children, className = '', variant = 'default', hoverable = false }) => {
  const baseStyles = 'rounded-2xl';
  const variants = {
    default: 'bg-cream-50 border border-cream-300',
    elevated: 'bg-cream-50 border border-cream-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
    accent: 'bg-cinnabar-50 border border-cinnabar-200',
    dark: 'bg-cream-800 text-cream-100',
    transparent: ''
  };

  const hoverStyles = hoverable ? 'transition-all duration-300 hover:border-cinnabar-500 hover:shadow-[0_8px_30px_rgb(197,61,47,0.08)]' : '';

  return (
    <div className={`${baseStyles} ${variants[variant] || ''} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
