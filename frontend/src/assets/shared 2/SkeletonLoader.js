import React, { memo } from 'react';
import { motion } from 'framer-motion';

// Skeleton loader component for instant rendering
export const SkeletonCard = memo(() => (
  <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
  </div>
));

export const SkeletonText = memo(({ lines = 3, className = "" }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-200 rounded mb-2 animate-pulse"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
));

export const SkeletonImage = memo(({ className = "w-full h-64" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
));

export const SkeletonTitle = memo(() => (
  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
));

// Full page skeleton for sections
export const SectionSkeleton = memo(() => (
  <div className="py-16 bg-gray-50 min-h-screen">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <SkeletonTitle />
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  </div>
));

export default SectionSkeleton;

