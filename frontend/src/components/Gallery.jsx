import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import SectionTitle from '../assets/ui/SectionTitle';
import { motion } from 'framer-motion';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Gallery = () => {
  const { translatedData, isLoading } = useLanguage();

  const galleryTitle = useTranslateText("Gallery");
  const galleryDescription = useTranslateText("Check out moments from various experiences in my professional and academic career.");

  if (!translatedData || !translatedData.gallery) {
    return (
      <AnimationWrapper>
        <section id="gallery" className="py-24 bg-cream-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-12 bg-cream-200 animate-pulse rounded-2xl mb-4 w-48"></div>
            <div className="h-96 bg-cream-200 animate-pulse rounded-2xl"></div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { gallery } = translatedData;
  const carouselItems = gallery.filter((item) => item.showInCarousel);

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-cream-50 border border-cream-300 hover:border-cinnabar-500 hover:text-cinnabar-500 p-3 rounded-full transition-all duration-200"
      aria-label="Next slide"
    >
      <FaChevronRight className="text-lg" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-cream-50 border border-cream-300 hover:border-cinnabar-500 hover:text-cinnabar-500 p-3 rounded-full transition-all duration-200"
      aria-label="Previous slide"
    >
      <FaChevronLeft className="text-lg" />
    </button>
  );

  const settings = {
    dots: true,
    infinite: carouselItems.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    adaptiveHeight: false,
    cssEase: 'ease-out',
    fade: true,
    swipeToSlide: true,
    waitForAnimate: true
  };

  return (
    <AnimationWrapper>
      <section id="gallery" className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>{galleryTitle}</SectionTitle>
          <motion.p
            className="font-body text-cream-500 mb-12 text-lg max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {galleryDescription}
          </motion.p>

          {carouselItems.length > 0 ? (
            <div className="relative">
              <Slider {...settings}>
                {carouselItems.map((item, index) => (
                  <div key={index} className="outline-none">
                    <div className="overflow-hidden">
                      <div className="relative w-full flex justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="max-h-[70vh] md:max-h-[600px] w-auto object-contain rounded-2xl border border-cream-300"
                        />
                      </div>
                      <div className="pt-6 pb-2">
                        <h3 className="text-2xl font-display font-semibold text-cream-800 mb-2">{item.title}</h3>
                        <p className="font-body text-cream-500 mb-4">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.category && item.category.map((cat, catIndex) => (
                            <span
                              key={catIndex}
                              className="font-mono text-xs uppercase tracking-wider bg-cinnabar-50 text-cinnabar-500 border border-cinnabar-200 rounded-full px-3 py-1"
                            >
                              {cat.categoryName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-cream-400">No featured items yet.</p>
            </div>
          )}

          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-cinnabar-500 text-cinnabar-500 rounded-xl font-display font-semibold hover:bg-cinnabar-500 hover:text-white transition-colors duration-200"
            >
              See Full Gallery
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Gallery;
