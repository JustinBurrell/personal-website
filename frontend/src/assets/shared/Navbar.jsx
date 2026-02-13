import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../../features/language';
import { useTranslateText } from '../../features/language/useTranslateText';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { safeScrollToTop } from '../../utils/scrollUtils';
import prefetchManager from '../../utils/prefetch';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  const homeText = useTranslateText("Home");
  const aboutText = useTranslateText("About");
  const galleryText = useTranslateText("Gallery");
  const contactText = useTranslateText("Contact");
  const educationText = useTranslateText("Education");
  const experienceText = useTranslateText("Experience");
  const projectsText = useTranslateText("Projects");
  const awardsText = useTranslateText("Awards");
  const menuText = useTranslateText("Open main menu");
  const professionalExperienceText = useTranslateText("Professional Experience");
  const leadershipExperienceText = useTranslateText("Leadership Experience");
  const schoolingText = useTranslateText("Schooling");
  const certificationsText = useTranslateText("Certifications");
  const programsText = useTranslateText("Programs");

  useScrollSpy({
    enabled: location.pathname === '/',
    pathname: location.pathname
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(userAgent);
      const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);
      const isIPad = /macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
      setIsMobileDevice(isMobile || isTablet || isIPad);
    };

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveSubmenu(null);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkDevice);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const navItems = [
    {
      name: homeText,
      to: '/',
      subItems: [
        { name: aboutText, to: 'about' },
        { name: galleryText, to: 'gallery' },
        { name: contactText, to: 'contact' }
      ]
    },
    {
      name: educationText,
      to: '/education',
      subItems: [
        { name: schoolingText, to: 'schooling-section' },
        { name: certificationsText, to: 'certifications-section' },
        { name: programsText, to: 'programs-section' }
      ]
    },
    {
      name: experienceText,
      to: '/experience',
      subItems: [
        { name: professionalExperienceText, to: 'professional-experience-section' },
        { name: leadershipExperienceText, to: 'leadership-experience-section' }
      ]
    },
    { name: projectsText, to: '/projects' },
    { name: awardsText, to: '/awards' },
  ];

  const isActive = (path) => {
    return location.pathname === path ? 'text-cinnabar-500' : 'text-cream-500';
  };

  const handleMouseEnter = (itemName, item) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveSubmenu(itemName);

    if (item && item.to && item.to !== '/') {
      const route = item.to.slice(1);
      if (route) {
        prefetchManager.prefetchSection(route);
      }
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 300);
  };

  const handleNavItemClick = (item) => {
    setIsOpen(false);
    setActiveSubmenu(null);
    if (location.pathname === item.to) {
      safeScrollToTop();
    } else {
      navigate(item.to);
    }
  };

  const handleSubItemClick = (subItem, parentItem) => {
    if (location.pathname === parentItem.to) {
      return (
        <ScrollLink
          to={subItem.to}
          spy={true}
          smooth={true}
          offset={-80}
          duration={500}
          activeClass="text-cinnabar-500"
          className="block px-4 py-2 text-sm font-display text-cream-600 hover:bg-cream-100 hover:text-cinnabar-500 cursor-pointer transition-colors"
          onClick={() => {
            setActiveSubmenu(null);
            setIsOpen(false);
          }}
        >
          {subItem.name}
        </ScrollLink>
      );
    } else {
      return (
        <Link
          to={parentItem.to}
          className="block px-4 py-2 text-sm font-display text-cream-600 hover:bg-cream-100 hover:text-cinnabar-500 transition-colors"
          onClick={async (e) => {
            setActiveSubmenu(null);
            setIsOpen(false);
            e.preventDefault();
            navigate(parentItem.to, { state: { scrollTo: subItem.to } });
          }}
        >
          {subItem.name}
        </Link>
      );
    }
  };

  return (
    <nav className="fixed w-full bg-cream-100/80 backdrop-blur-xl border-b border-cream-300 z-50" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                if (location.pathname === '/') {
                  safeScrollToTop();
                } else {
                  navigate('/');
                }
              }}
              className="text-xl font-display font-bold tracking-tight text-cream-800 hover:text-cinnabar-500 transition-colors"
            >
              Justin Burrell
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobileDevice && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.subItems) {
                      handleMouseEnter(item.name, item);
                    } else {
                      if (item.to && item.to !== '/') {
                        const route = item.to.slice(1);
                        if (route) {
                          prefetchManager.prefetchSection(route);
                        }
                      }
                    }
                  }}
                  onMouseLeave={item.subItems ? handleMouseLeave : undefined}
                  onFocus={() => {
                    if (item.to && item.to !== '/') {
                      const route = item.to.slice(1);
                      if (route) {
                        prefetchManager.prefetchSection(route);
                      }
                    }
                  }}
                >
                  <button
                    onClick={() => handleNavItemClick(item)}
                    className={`px-3 py-2 text-sm font-display font-medium uppercase tracking-wide ${isActive(item.to)} hover:text-cinnabar-500 transition-colors`}
                  >
                    {item.name}
                  </button>
                  {item.subItems && activeSubmenu === item.name && (
                    <div
                      className="absolute left-0 mt-2 w-48 rounded-xl bg-cream-50 border border-cream-300 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden"
                      onMouseEnter={() => handleMouseEnter(item.name, item)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="py-1" role="menu">
                        {item.subItems.map((subItem) => (
                          <div key={subItem.name}>
                            {handleSubItemClick(subItem, item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <LanguageSelector />
            </div>
          )}

          {/* Mobile menu button */}
          <div className={isMobileDevice ? "flex items-center" : "md:hidden flex items-center"}>
            <LanguageSelector />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-cream-500 hover:text-cinnabar-500 hover:bg-cream-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cinnabar-500 transition-colors"
            >
              <span className="sr-only">{menuText}</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`${isOpen && isMobileDevice ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-cream-300">
            {navItems.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleNavItemClick(item)}
                    className={`flex-grow text-left px-3 py-2 rounded-xl text-base font-display font-medium ${isActive(item.to)} hover:text-cinnabar-500 hover:bg-cream-200 transition-colors`}
                  >
                    {item.name}
                  </button>
                  {item.subItems && (
                    <button
                      onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                      className="px-4 py-2 text-cream-400 hover:text-cinnabar-500 transition-colors"
                    >
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          activeSubmenu === item.name ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                {item.subItems && activeSubmenu === item.name && (
                  <div className="pl-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <div key={subItem.name}>
                        {handleSubItemClick(subItem, item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
