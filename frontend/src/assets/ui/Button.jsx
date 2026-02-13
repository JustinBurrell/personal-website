import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  className = '',
  type = 'button',
  as = 'a',
  href,
  target,
  rel,
  customColor,
  ...props
}) => {
  const baseStyles = 'rounded-xl font-display font-medium transition-all duration-200';

  const variants = {
    primary: 'bg-cinnabar-500 text-white hover:bg-cinnabar-600',
    secondary: 'bg-cream-200 text-cream-800 hover:bg-cream-300',
    outline: 'border-2 border-cinnabar-500 text-cinnabar-500 hover:bg-cinnabar-50',
    ghost: 'text-cinnabar-500 hover:bg-cinnabar-50',
    organization: 'text-white hover:opacity-90 transform hover:-translate-y-0.5 font-mono text-xs uppercase tracking-wider',
    tag: 'bg-cream-200 text-cream-600 font-mono text-xs uppercase tracking-wider hover:bg-cream-300 rounded-full'
  };

  const sizes = {
    xsmall: 'px-1.5 py-0.5 text-xs',
    small: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const classes = `${baseStyles} ${variants[variant] || ''} ${sizes[size]} ${className}`;

  const getOrganizationStyles = (color) => ({
    backgroundColor: color,
    ':hover': {
      backgroundColor: color,
    }
  });

  if (as === 'a') {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onClick={onClick}
        style={customColor && variant === 'organization' ? getOrganizationStyles(customColor) : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      style={customColor && variant === 'organization' ? getOrganizationStyles(customColor) : undefined}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
