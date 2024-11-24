import dotenv from 'dotenv';

dotenv.config();

export const config = {
  telegram: {
    token: process.env.BOT_TOKEN,
    options: { 
      polling: true,
      filepath: false // Disable file downloading for security
    }
  },
  api: {
    baseUrl: 'http://dorar.net/dorar_api.json',
    timeout: 10000, // 10 seconds
    retries: 3
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  cache: {
    ttl: 3600 // 1 hour
  }
};