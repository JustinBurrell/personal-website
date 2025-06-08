import React from 'react';

const Card = ({ children, className = '', variant = 'default' }) => {
  const baseStyles = 'rounded-lg';
  const variants = {
    default: 'bg-white shadow-lg',
    transparent: ''
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
