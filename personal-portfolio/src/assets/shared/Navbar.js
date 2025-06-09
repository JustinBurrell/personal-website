import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink, Events, scrollSpy } from 'react-scroll';
import { scroller } from 'react-scroll';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Initialize scrollspy
    scrollSpy.update();

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Remove all Events listeners
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  const navItems = [
    {
      name: 'Home',
      to: '/',
      subItems: [
        { name: 'About', to: 'about' },
        { name: 'Gallery', to: 'gallery' },
        { name: 'Contact', to: 'contact' }
      ]
    },
    { name: 'Education', to: '/education' },
    { name: 'Experience', to: '/experience' },
    { name: 'Projects', to: '/projects' },
    { name: 'Awards', to: '/awards' },
  ];

  const isActive = (path) => {
    return location.pathname === path ? 'text-indigo-600' : 'text-gray-700';
  };

  const handleMouseEnter = (itemName) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveSubmenu(itemName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 300);
  };

  const handleNavItemClick = (item) => {
    navigate(item.to);
    if (location.pathname === '/' && item.to === '/') {
      scrollToTop();
    }
    setActiveSubmenu(null);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }
  };

  const handleSubItemClick = (subItem) => {
    if (location.pathname === '/') {
      return (
        <ScrollLink
          to={subItem.to}
          spy={true}
          smooth={true}
          offset={-64} // Adjust this value based on your navbar height
          duration={500}
          activeClass="text-indigo-600"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 cursor-pointer"
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
          to={`/#${subItem.to}`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
          onClick={() => {
            setActiveSubmenu(null);
            setIsOpen(false);
          }}
        >
          {subItem.name}
        </Link>
      );
    }
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}  
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={handleHomeClick} className="text-xl font-bold">Justin Burrell</Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => item.subItems && handleMouseEnter(item.name)}
                onMouseLeave={item.subItems ? handleMouseLeave : undefined}
              >
                <button
                  onClick={() => handleNavItemClick(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(item.to)} hover:text-gray-900 hover:bg-gray-50`}
                >
                  {item.name}
                </button>
                {item.subItems && activeSubmenu === item.name && (
                  <div 
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-1" role="menu">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.name} className="hover:bg-gray-50">
                          {handleSubItemClick(subItem)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.name}>
                {/* Main nav item */}
                <div className="flex items-center">
                  {/* Main button */}
                  <button
                    onClick={() => {
                      if (item.name === 'Home') {
                        handleNavItemClick(item);
                        setIsOpen(false);
                      } else {
                        handleNavItemClick(item);
                        setIsOpen(false);
                        setActiveSubmenu(null);
                      }
                    }}
                    className={`flex-grow px-3 py-2 rounded-md text-base font-medium ${isActive(item.to)} hover:text-gray-900 hover:bg-gray-50 text-left`}
                  >
                    {item.name}
                  </button>
                  
                  {/* Dropdown toggle for items with subItems */}
                  {item.subItems && (
                    <button
                      onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                      className="px-3 py-2"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          activeSubmenu === item.name ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Submenu items */}
                {item.subItems && activeSubmenu === item.name && (
                  <div className="pl-4 py-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <div key={subItem.name}>
                        {location.pathname === '/' ? (
                          <button
                            onClick={() => {
                              scroller.scrollTo(subItem.to, {
                                smooth: true,
                                offset: -64,
                                duration: 500
                              });
                              setIsOpen(false);
                              setActiveSubmenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                          >
                            {subItem.name}
                          </button>
                        ) : (
                          <Link
                            to={`/#${subItem.to}`}
                            className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                            onClick={() => {
                              setIsOpen(false);
                              setActiveSubmenu(null);
                            }}
                          >
                            {subItem.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 