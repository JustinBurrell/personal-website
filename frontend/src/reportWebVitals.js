import performanceOptimizer from './utils/performance';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        performanceOptimizer.trackWebVital('CLS', metric.value);
        onPerfEntry(metric);
      });
      getFID((metric) => {
        performanceOptimizer.trackWebVital('FID', metric.value);
        onPerfEntry(metric);
      });
      getFCP((metric) => {
        performanceOptimizer.trackWebVital('FCP', metric.value);
        onPerfEntry(metric);
      });
      getLCP((metric) => {
        performanceOptimizer.trackWebVital('LCP', metric.value);
        onPerfEntry(metric);
      });
      getTTFB((metric) => {
        performanceOptimizer.trackWebVital('TTFB', metric.value);
        onPerfEntry(metric);
      });
    });
  }
};

export default reportWebVitals; 