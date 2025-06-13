import React from 'react';
import Slider from 'react-slick';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import Card from '../assets/ui/Card';
import { motion } from 'framer-motion';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Gallery = () => {
  const { translatedData } = useLanguage();
  const { gallery } = translatedData;

  // Use translation hook for static text
  const galleryTitle = useTranslateText("Gallery");
  const galleryDescription = useTranslateText("Check out moments from various experiences in my professional and academic career.");

  // Custom arrow components
  const NextArrow = ({ onClick }) => (
    <motion.button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
      aria-label="Next slide"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaChevronRight className="text-gray-800 text-xl" />
    </motion.button>
  );

  const PrevArrow = ({ onClick }) => (
    <motion.button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
      aria-label="Previous slide"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaChevronLeft className="text-gray-800 text-xl" />
    </motion.button>
  );

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    adaptiveHeight: true
  };

  return (
    <AnimationWrapper>
      <section id="gallery" className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20px" }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 bg-white">
                <motion.h2 
                  className="text-4xl font-bold text-center mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {galleryTitle}
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-center mb-12 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {galleryDescription}
                </motion.p>
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ margin: "-20px" }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <Slider {...settings}>
                    {gallery.map((item, index) => (
                      <div key={index} className="outline-none">
                        <motion.div 
                          className="overflow-hidden"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ margin: "-20px" }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="relative w-full flex justify-center bg-white">
                            <motion.img
                              src={item.imageUrl}
                              alt={item.title}
                              className="max-h-[600px] w-auto object-contain rounded-t-lg"
                              initial={{ scale: 1.1 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ margin: "-20px" }}
                              transition={{ duration: 0.8 }}
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
                </motion.div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Gallery;