import { BotHandler } from './bot/botHandler.js';
import logger from './logger.js';

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
});

try {
  new BotHandler();
  logger.info('Bot started successfully');
} catch (error) {
  logger.error('Failed to start bot:', { error: error.message });
  process.exit(1);
}