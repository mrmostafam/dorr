import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { BotHandler } from './bot/botHandler.js';
import logger from './logger.js';

// Create Express app for health checks
const app = express();
app.use(helmet());
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
});

// Start bot and server
try {
  new BotHandler();
  logger.info('Bot started successfully');

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Health check server running on port ${PORT}`);
  });
} catch (error) {
  logger.error('Failed to start bot:', { error: error.message });
  process.exit(1);
}