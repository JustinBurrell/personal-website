/**
 * Simple test utilities for scroll functions
 * These can be run in the browser console to verify functionality
 */

// Test safeScrollTo function
export const testSafeScrollTo = async () => {
  console.log('Testing safeScrollTo...');
  
  try {
    // Test scrolling to a non-existent element
    const result1 = await safeScrollTo('non-existent-element');
    console.log('Scroll to non-existent element:', result1); // Should be false
    
    // Test scrolling to an existing element (if any)
    const result2 = await safeScrollTo('home');
    console.log('Scroll to existing element:', result2); // Should be true
    
    return { result1, result2 };
  } catch (error) {
    console.error('Test failed:', error);
    return { error: error.message };
  }
};

// Test safeScrollToTop function
export const testSafeScrollToTop = async () => {
  console.log('Testing safeScrollToTop...');
  
  try {
    const result = await safeScrollToTop();
    console.log('Scroll to top result:', result); // Should be true
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    return { error: error.message };
  }
};

// Test isElementInViewport function
export const testIsElementInViewport = async () => {
  console.log('Testing isElementInViewport...');
  
  try {
    const result = await isElementInViewport('home');
    console.log('Element in viewport:', result);
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    return { error: error.message };
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('=== Running Scroll Utils Tests ===');
  
  const results = {
    safeScrollTo: await testSafeScrollTo(),
    safeScrollToTop: await testSafeScrollToTop(),
    isElementInViewport: await testIsElementInViewport()
  };
  
  console.log('=== Test Results ===', results);
  return results;
};

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.testScrollUtils = {
    testSafeScrollTo,
    testSafeScrollToTop,
    testIsElementInViewport,
    runAllTests
  };
} 