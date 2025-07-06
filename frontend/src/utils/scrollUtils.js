import { scroller } from 'react-scroll';

/**
 * Safely scroll to an element with error handling
 * @param {string} target - The target element ID or selector
 * @param {Object} options - Scroll options
 * @returns {Promise<boolean>} - Whether the scroll was successful
 */
export const safeScrollTo = async (target, options = {}) => {
  const {
    duration = 600,
    smooth = 'easeInOutQuart',
    offset = -80,
    delay = 0
  } = options;

  try {
    // Check if target element exists
    const element = document.getElementById(target) || document.querySelector(target);
    if (!element) {
      console.warn(`Target element "${target}" not found`);
      return false;
    }

    // Add delay if specified
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Use react-scroll scroller
    scroller.scrollTo(target, {
      duration,
      smooth,
      offset
    });

    return true;
  } catch (error) {
    console.warn(`Scroll to "${target}" failed:`, error.message);
    
    // Fallback to native scroll
    try {
      const element = document.getElementById(target) || document.querySelector(target);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        return true;
      }
    } catch (fallbackError) {
      console.error('Fallback scroll also failed:', fallbackError.message);
    }
    
    return false;
  }
};

/**
 * Safely scroll to top of page
 * @param {Object} options - Scroll options
 * @returns {Promise<boolean>} - Whether the scroll was successful
 */
export const safeScrollToTop = async (options = {}) => {
  const { behavior = 'smooth' } = options;
  
  try {
    window.scrollTo({ top: 0, behavior });
    return true;
  } catch (error) {
    console.warn('Scroll to top failed:', error.message);
    return false;
  }
};

/**
 * Check if an element is in viewport
 * @param {string|Element} target - Element ID, selector, or element
 * @param {Object} options - Options for intersection observer
 * @returns {Promise<boolean>} - Whether element is in viewport
 */
export const isElementInViewport = (target, options = {}) => {
  return new Promise((resolve) => {
    const {
      threshold = 0.1,
      rootMargin = '0px'
    } = options;

    try {
      const element = typeof target === 'string' 
        ? (document.getElementById(target) || document.querySelector(target))
        : target;

      if (!element) {
        resolve(false);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          observer.disconnect();
          resolve(entry.isIntersecting);
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
    } catch (error) {
      console.warn('Error checking viewport:', error.message);
      resolve(false);
    }
  });
};

/**
 * Wait for an element to be available in DOM
 * @param {string} selector - Element selector
 * @param {number} timeout - Maximum time to wait in ms
 * @returns {Promise<Element|null>} - The element or null if not found
 */
export const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const startTime = Date.now();
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
        return;
      }

      if (Date.now() - startTime > timeout) {
        observer.disconnect();
        resolve(null);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}; 