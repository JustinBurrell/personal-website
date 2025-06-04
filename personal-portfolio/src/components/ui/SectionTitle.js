import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default SectionTitle; 