// IndexedDB cache for persistent data storage across sessions
class IndexedDBCache {
  constructor() {
    this.dbName = 'portfolioCache';
    this.dbVersion = 1;
    this.db = null;
    this.initPromise = null;
  }

  // Initialize IndexedDB
  async init() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('portfolioData')) {
          const portfolioStore = db.createObjectStore('portfolioData', { keyPath: 'key' });
          portfolioStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('cacheMetadata')) {
          db.createObjectStore('cacheMetadata', { keyPath: 'key' });
        }
      };
    });

    return this.initPromise;
  }

  // Set data in cache
  async set(key, data, maxAge = 30 * 60 * 1000) {
    try {
      await this.init();
      const transaction = this.db.transaction(['portfolioData'], 'readwrite');
      const store = transaction.objectStore('portfolioData');
      
      const cacheEntry = {
        key,
        data,
        timestamp: Date.now(),
        maxAge
      };
      
      await store.put(cacheEntry);
      return true;
    } catch (error) {
      console.error('Error setting cache:', error);
      return false;
    }
  }

  // Get data from cache
  async get(key) {
    try {
      await this.init();
      const transaction = this.db.transaction(['portfolioData'], 'readonly');
      const store = transaction.objectStore('portfolioData');
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        
        request.onsuccess = () => {
          const result = request.result;
          
          if (!result) {
            resolve(null);
            return;
          }
          
          // Check if cache is still valid
          const age = Date.now() - result.timestamp;
          if (age > result.maxAge) {
            // Cache expired, delete it
            this.delete(key);
            resolve(null);
            return;
          }
          
          resolve(result.data);
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  // Delete data from cache
  async delete(key) {
    try {
      await this.init();
      const transaction = this.db.transaction(['portfolioData'], 'readwrite');
      const store = transaction.objectStore('portfolioData');
      await store.delete(key);
      return true;
    } catch (error) {
      console.error('Error deleting cache:', error);
      return false;
    }
  }

  // Clear all cache
  async clear() {
    try {
      await this.init();
      const transaction = this.db.transaction(['portfolioData'], 'readwrite');
      const store = transaction.objectStore('portfolioData');
      await store.clear();
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  // Get cache size (approximate)
  async getSize() {
    try {
      await this.init();
      const transaction = this.db.transaction(['portfolioData'], 'readonly');
      const store = transaction.objectStore('portfolioData');
      
      return new Promise((resolve) => {
        const request = store.count();
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          resolve(0);
        };
      });
    } catch (error) {
      return 0;
    }
  }

  // Clean expired entries
  async cleanExpired() {
    try {
      await this.init();
      const transaction = this.db.transaction(['portfolioData'], 'readwrite');
      const store = transaction.objectStore('portfolioData');
      const index = store.index('timestamp');
      
      return new Promise((resolve) => {
        const request = index.openCursor();
        const now = Date.now();
        let deleted = 0;
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const entry = cursor.value;
            const age = now - entry.timestamp;
            
            if (age > entry.maxAge) {
              cursor.delete();
              deleted++;
            }
            cursor.continue();
          } else {
            resolve(deleted);
          }
        };
        
        request.onerror = () => {
          resolve(0);
        };
      });
    } catch (error) {
      console.error('Error cleaning expired cache:', error);
      return 0;
    }
  }
}

// Create singleton instance
const indexedDBCache = new IndexedDBCache();

// Clean expired entries on initialization
if (typeof window !== 'undefined') {
  indexedDBCache.init().then(() => {
    indexedDBCache.cleanExpired();
  });
}

export default indexedDBCache;

