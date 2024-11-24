import NodeCache from 'node-cache';
import logger from '../logger.js';

export class CacheManager {
  constructor(ttlSeconds = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });

    this.cache.on('expired', (key) => {
      logger.info('Cache expired for key:', { key });
    });
  }

  get(key) {
    try {
      return this.cache.get(key);
    } catch (error) {
      logger.error('Cache get error:', { error: error.message, key });
      return null;
    }
  }

  set(key, value) {
    try {
      return this.cache.set(key, value);
    } catch (error) {
      logger.error('Cache set error:', { error: error.message, key });
    }
  }

  delete(key) {
    try {
      return this.cache.del(key);
    } catch (error) {
      logger.error('Cache delete error:', { error: error.message, key });
    }
  }
}