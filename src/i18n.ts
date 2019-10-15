import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './l10n/en.json'
import ro from './l10n/ro.json'
import ru from './l10n/ru.json'

const resources = {
  en: { translation: en },
  ro: { translation: ro },
  ru: { translation: ru },
}

/**
 * Infer translation keys
 */
export type TranslateKeys = keyof typeof en

i18n.use(initReactI18next).init({
  resources,
  /**
   * Changing language will be added in a future PR
   */
  lng: 'en',
  /**
   * Use flat keys in l10n files, nested objects not allowed
   * TypeScript will help with keys inference
   */
  keySeparator: false,
  interpolation: {
    escapeValue: false, // not needed for react
  },
})

export { i18n }
