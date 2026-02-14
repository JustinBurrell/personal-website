import React from 'react';
import { motion } from 'framer-motion';

const TextReveal = ({ text, className = '', as: Tag = 'h1', delay = 0 }) => {
  if (!text) return null;

  const words = text.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
