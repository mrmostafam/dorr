export class MessageFormatter {
  static formatHadith(hadith) {
    const emoji = hadith.isAuthentic ? '🌕' : '🌑';
    const sections = [];
    
    // Main hadith text with emoji
    sections.push(`${emoji} ${hadith.text}`);
    sections.push('');  // Empty line for spacing
    
    // Additional information
    const fields = [
      { label: 'شرح الحديث', value: hadith.explanation },
      { label: 'درجة الحديث', value: hadith.grade },
      { label: 'الراوي', value: hadith.narrator },
      { label: 'المحدث', value: hadith.muhaddith }
    ];

    // Optional fields
    if (hadith.source) fields.push({ label: 'المصدر', value: hadith.source });
    if (hadith.page) fields.push({ label: 'الصفحة', value: hadith.page });
    if (hadith.volume) fields.push({ label: 'الجزء', value: hadith.volume });

    // Add all available fields
    sections.push(
      ...fields
        .filter(field => field.value)
        .map(field => `- ${field.label}: ${field.value}`)
    );

    return sections.join('\n');
  }

  static getWelcomeMessage() {
    return [
      'مرحباً بك في بوت الأحاديث! 📚',
      '',
      'الأوامر المتاحة:',
      '/hadith <كلمة البحث> - البحث عن حديث',
      '/help - عرض المساعدة',
      '',
      '🌕 = حديث صحيح',
      '🌑 = حديث ضعيف'
    ].join('\n');
  }

  static getHelpMessage() {
    return [
      'كيفية استخدام البوت:',
      '',
      '1. للبحث عن حديث:',
      '   /hadith <كلمة البحث>',
      '   مثال: /hadith الصلاة',
      '',
      '2. معنى الرموز:',
      '   🌕 = حديث صحيح',
      '   🌑 = حديث ضعيف',
      '',
      '3. للحصول على هذه المساعدة:',
      '   /help'
    ].join('\n');
  }

  static getErrorMessage() {
    return 'عذراً، حدث خطأ أثناء جلب البيانات. الرجاء المحاولة مرة أخرى لاحقاً. 🙏';
  }

  static getNoResultsMessage() {
    return 'لم يتم العثور على نتائج للبحث. 🔍\nالرجاء المحاولة بكلمات بحث مختلفة.';
  }

  static getSearchingMessage() {
    return 'جاري البحث... 🔍';
  }
}