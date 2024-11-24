import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/hadith (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const searchTerm = match[1];

  try {
    const response = await fetch(`http://dorar.net/dorar_api.json?skey=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    
    if (!data.ahadith || !data.ahadith.result) {
      bot.sendMessage(chatId, 'لم يتم العثور على نتائج');
      return;
    }

    const results = data.ahadith.result;
    const htmlResults = results.replace(/<[^>]*>/g, '');
    
    // Parse the results to extract required information
    const hadiths = htmlResults.split('\n\n').filter(h => h.trim());
    
    for (const hadith of hadiths) {
      const lines = hadith.split('\n');
      let formattedMessage = '';
      
      // Determine hadith grade and emoji
      const isAuthentic = hadith.toLowerCase().includes('صحيح');
      const emoji = isAuthentic ? '🌕' : '🌑';
      
      // Extract information
      const hadithText = lines[0] || '';
      const explanation = lines.find(l => l.includes('الشرح')) || '';
      const grade = lines.find(l => l.includes('الدرجة')) || '';
      const narrator = lines.find(l => l.includes('الراوي')) || '';
      const muhaddith = lines.find(l => l.includes('المحدث')) || '';
      
      // Format message
      formattedMessage = `${emoji} ${hadithText}\n\n`;
      formattedMessage += explanation ? `- شرح الحديث: ${explanation.split(':')[1]}\n` : '';
      formattedMessage += grade ? `- درجة الحديث: ${grade.split(':')[1]}\n` : '';
      formattedMessage += narrator ? `- الراوي: ${narrator.split(':')[1]}\n` : '';
      formattedMessage += muhaddith ? `- المحدث: ${muhaddith.split(':')[1]}` : '';
      
      await bot.sendMessage(chatId, formattedMessage, { parse_mode: 'HTML' });
    }
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, 'حدث خطأ أثناء جلب البيانات');
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'مرحباً بك في بوت الأحاديث! استخدم الأمر /hadith متبوعاً بكلمة البحث للبحث عن الأحاديث.');
});

console.log('Bot is running...');