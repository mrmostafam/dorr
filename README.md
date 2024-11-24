# Hadith Telegram Bot

بوت تيليجرام للبحث في الأحاديث النبوية

## المتطلبات

- Node.js 18 أو أحدث
- توكن بوت تيليجرام

## التثبيت

1. انسخ الملف `.env.example` إلى `.env`:
```bash
cp .env.example .env
```

2. أضف توكن البوت الخاص بك في ملف `.env`:
```
BOT_TOKEN=your_telegram_bot_token_here
```

3. ثبت الاعتمادات:
```bash
npm install
```

4. شغل البوت:
```bash
npm start
```

## النشر على Railway

1. انشئ حساب على [Railway](https://railway.app)
2. اربط مستودع GitHub الخاص بك
3. أضف المتغيرات البيئية (`BOT_TOKEN`)
4. انشر المشروع

## الأوامر المتاحة

- `/start` - بدء استخدام البوت
- `/help` - عرض المساعدة
- `/hadith <كلمة البحث>` - البحث عن حديث