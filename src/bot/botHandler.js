import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config.js';
import { HadithService } from '../services/hadithService.js';
import { MessageFormatter } from './messageFormatter.js';
import logger from '../logger.js';

export class BotHandler {
  constructor() {
    this.bot = new TelegramBot(config.telegram.token, config.telegram.options);
    this.setupHandlers();
    this.setupCommands();
  }

  setupHandlers() {
    this.bot.onText(/\/hadith (.+)/, this.handleHadithSearch.bind(this));
    this.bot.onText(/\/start/, this.handleStart.bind(this));
    this.bot.onText(/\/help/, this.handleHelp.bind(this));
    this.bot.on('error', this.handleError.bind(this));
    this.bot.on('polling_error', this.handlePollingError.bind(this));
  }

  async setupCommands() {
    try {
      await this.bot.setMyCommands([
        { command: 'start', description: 'بدء استخدام البوت' },
        { command: 'help', description: 'عرض المساعدة' },
        { command: 'hadith', description: 'البحث عن حديث' }
      ]);
    } catch (error) {
      logger.error('Error setting up commands:', { error: error.message });
    }
  }

  async handleHadithSearch(msg, match) {
    const chatId = msg.chat.id;
    const searchTerm = match[1];
    const messageId = msg.message_id;

    try {
      // Send "searching" message
      const searchingMsg = await this.bot.sendMessage(
        chatId, 
        MessageFormatter.getSearchingMessage()
      );

      logger.info('Searching hadith', { 
        chatId, 
        searchTerm,
        username: msg.from.username 
      });

      const hadiths = await HadithService.searchHadith(searchTerm);

      // Delete "searching" message
      await this.bot.deleteMessage(chatId, searchingMsg.message_id);

      if (hadiths.length === 0) {
        await this.bot.sendMessage(
          chatId, 
          MessageFormatter.getNoResultsMessage(),
          { reply_to_message_id: messageId }
        );
        return;
      }

      for (const hadith of hadiths) {
        const message = MessageFormatter.formatHadith(hadith);
        await this.bot.sendMessage(chatId, message, {
          parse_mode: 'HTML',
          reply_to_message_id: messageId
        });
      }
    } catch (error) {
      logger.error('Error in hadith search:', { 
        error: error.message, 
        chatId, 
        searchTerm 
      });
      await this.bot.sendMessage(
        chatId, 
        MessageFormatter.getErrorMessage(),
        { reply_to_message_id: messageId }
      );
    }
  }

  async handleStart(msg) {
    const chatId = msg.chat.id;
    try {
      await this.bot.sendMessage(
        chatId, 
        MessageFormatter.getWelcomeMessage(),
        { parse_mode: 'HTML' }
      );
      logger.info('New user started bot', { 
        chatId, 
        username: msg.from.username 
      });
    } catch (error) {
      logger.error('Error sending welcome message:', { 
        error: error.message, 
        chatId 
      });
    }
  }

  async handleHelp(msg) {
    const chatId = msg.chat.id;
    try {
      await this.bot.sendMessage(
        chatId, 
        MessageFormatter.getHelpMessage(),
        { parse_mode: 'HTML' }
      );
    } catch (error) {
      logger.error('Error sending help message:', { 
        error: error.message, 
        chatId 
      });
    }
  }

  handleError(error) {
    logger.error('Telegram bot error:', { error: error.message });
  }

  handlePollingError(error) {
    logger.error('Polling error:', { error: error.message });
  }
}