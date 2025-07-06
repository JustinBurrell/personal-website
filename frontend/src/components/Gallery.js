import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import Card from '../assets/ui/Card';
import { motion } from 'framer-motion';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Element } from 'react-scroll';

// Lazy loaded image component
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Image loading handled by onLoad event
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

const Gallery = () => {
  const { translatedData, isLoading } = useLanguage();

  // Use translation hook for static text
  const galleryTitle = useTranslateText("Gallery");
  const galleryDescription = useTranslateText("Check out moments from various experiences in my professional and academic career.");

  // Add loading state and null checks
  if (isLoading || !translatedData || !translatedData.gallery) {
    return (
      <AnimationWrapper>
        <section id="gallery" className="min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-8 max-w-6xl mx-auto">
              <Card className="p-8 bg-white">
                <div className="h-12 bg-gray-200 animate-pulse rounded mb-4"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded mb-12"></div>
                <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
              </Card>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { gallery } = translatedData;

  // Custom arrow components
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
      aria-label="Next slide"
    >
      <FaChevronRight className="text-gray-800 text-xl" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
      aria-label="Previous slide"
    >
      <FaChevronLeft className="text-gray-800 text-xl" />
    </button>
  );

  // Optimized slider settings for better performance
  const settings = {
    dots: true,
    infinite: true,
    speed: 300, // Faster transitions
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // Disable autoplay for better performance
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    adaptiveHeight: false, // Disable for better performance
    cssEase: 'ease-out',
    fade: false, // Disable fade for better performance
    swipeToSlide: true,
    waitForAnimate: false // Don't wait for animations
  };

  return (
    <AnimationWrapper>
      <section id="gallery" className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-white">
              <h2 className="text-4xl font-bold text-center mb-4">
                {galleryTitle}
              </h2>
              <p className="text-gray-600 text-center mb-12 text-lg">
                {galleryDescription}
              </p>
              <div className="relative">
                <Slider {...settings}>
                  {gallery.map((item, index) => (
                    <div key={index} className="outline-none">
                      <motion.div 
                        className="overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ margin: "-20px" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative w-full flex justify-center bg-white">
                          <motion.img
                            src={item.imageUrl}
                            alt={item.title}
                            className="max-h-[600px] w-auto object-contain rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <motion.div 
                          className="p-6 bg-white rounded-b-lg"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ margin: "-20px" }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.category && item.category.map((cat, catIndex) => (
                              <motion.span
                                key={catIndex}
                                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ margin: "-20px" }}
                                transition={{ 
                                  duration: 0.5, 
                                  delay: 0.2 + (catIndex * 0.1),
                                  type: "spring",
                                  stiffness: 100,
                                  damping: 15
                                }}
                                whileHover={{ scale: 1.1 }}
                              >
                                {cat.categoryName}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Gallery;