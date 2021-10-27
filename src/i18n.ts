import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './l10n/en.json'
import ro from './l10n/ro.json'
import ru from './l10n/ru.json'

/**
 * Infer translation keys
 */
export type TranslateKeys = keyof typeof en

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
      ru: { translation: ru },
    },
    fallbackLng: {
      en: ['ru', 'ro'],
      ru: ['ro', 'en'],
      ro: ['en', 'ru'],
    },
    /**
     * Use flat keys in l10n files, nested objects not allowed
     * TypeScript will help with keys inference
     */
    keySeparator: false,
    interpolation: {
      escapeValue: false, // not needed for react
    },
    detection: {
      order: ['querystring', 'localStorage', 'cookie', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupCookie: 'lang',
      lookupLocalStorage: 'lang',
      caches: ['localStorage', 'cookie'],
    },
  })

export { i18n }
