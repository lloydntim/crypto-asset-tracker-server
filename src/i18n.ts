

import i18next from 'i18next';
import { LanguageDetector } from 'i18next-http-middleware';

import translationEn from './locales/en/translation.json';
import translationDe from './locales/de/translation.json';

i18next
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: translationEn,
      },
      de: {
        translation: translationDe,
      },
    },
    fallbackLng: 'en',
    preload: ['en', 'de'],
    saveMissing: true
  });

export default i18next;