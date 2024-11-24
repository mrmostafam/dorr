import fetch from 'node-fetch';
import sanitizeHtml from 'sanitize-html';
import { config } from '../config.js';
import logger from '../logger.js';
import { CacheManager } from '../cache/cacheManager.js';

export class HadithService {
  static cache = new CacheManager();

  static async searchHadith(searchTerm) {
    try {
      // Check cache first
      const cacheKey = `hadith_${searchTerm}`;
      const cachedResults = this.cache.get(cacheKey);
      
      if (cachedResults) {
        logger.info('Cache hit for search term:', { searchTerm });
        return cachedResults;
      }

      const url = `${config.api.baseUrl}?skey=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url, { 
        timeout: config.api.timeout,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HadithBot/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const results = this.parseHadithResults(data);
      
      // Cache the results
      if (results.length > 0) {
        this.cache.set(cacheKey, results);
      }

      return results;
    } catch (error) {
      logger.error('Error fetching hadith:', { error: error.message, searchTerm });
      throw error;
    }
  }

  static parseHadithResults(data) {
    if (!data.ahadith || !data.ahadith.result) {
      return [];
    }

    const cleanHtml = sanitizeHtml(data.ahadith.result, {
      allowedTags: [],
      allowedAttributes: {}
    });

    return cleanHtml.split('\n\n')
      .filter(h => h.trim())
      .map(hadith => this.parseHadith(hadith));
  }

  static parseHadith(hadith) {
    const lines = hadith.split('\n');
    const isAuthentic = this.determineAuthenticity(hadith);
    
    return {
      text: lines[0] || '',
      explanation: this.extractField(lines, 'الشرح'),
      grade: this.extractField(lines, 'الدرجة'),
      narrator: this.extractField(lines, 'الراوي'),
      muhaddith: this.extractField(lines, 'المحدث'),
      isAuthentic,
      source: this.extractField(lines, 'المصدر'),
      page: this.extractField(lines, 'الصفحة'),
      volume: this.extractField(lines, 'الجزء')
    };
  }

  static determineAuthenticity(hadith) {
    const gradeIndicators = {
      authentic: ['صحيح', 'حسن'],
      weak: ['ضعيف', 'موضوع', 'منكر']
    };

    const hadithLower = hadith.toLowerCase();
    return gradeIndicators.authentic.some(grade => hadithLower.includes(grade));
  }

  static extractField(lines, fieldName) {
    const line = lines.find(l => l.includes(fieldName));
    return line ? line.split(':')[1]?.trim() : '';
  }
}