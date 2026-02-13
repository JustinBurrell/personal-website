// Production-safe logging utility
class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
  }

  // Only log in development
  log(...args) {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }

  // Only warn in development
  warn(...args) {
    if (this.isDevelopment) {
      console.warn(...args);
    }
  }

  // Only error in development (but always log critical errors)
  error(...args) {
    if (this.isDevelopment) {
      console.error(...args);
    } else {
      // In production, only log critical errors
      console.error('[ERROR]', ...args);
    }
  }

  // Performance logging - only in development
  performance(message, time) {
    if (this.isDevelopment) {
      console.log(`📊 ${message}: ${time.toFixed(2)}ms`);
    }
  }

  // Image preloading - only in development
  imagePreload(message, ...args) {
    if (this.isDevelopment) {
      console.log(`🖼️ ${message}`, ...args);
    }
  }

  // Data operations - only in development
  data(message, ...args) {
    if (this.isDevelopment) {
      console.log(`📦 ${message}`, ...args);
    }
  }

  // Performance optimizations - only in development
  performanceOpt(message, ...args) {
    if (this.isDevelopment) {
      console.log(`🚀 ${message}`, ...args);
    }
  }

  // Route operations - only in development
  route(message, ...args) {
    if (this.isDevelopment) {
      console.log(`🛣️ ${message}`, ...args);
    }
  }

  // Critical operations - always log (for debugging production issues)
  critical(message, ...args) {
    console.log(`🚨 ${message}`, ...args);
  }
}

// Create singleton instance
const logger = new Logger();

export default logger; 