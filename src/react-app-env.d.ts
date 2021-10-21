/// <reference types="react-scripts" />
import { TFunctionResult } from 'i18next'
import { TranslateKeys } from './i18n'

/**
 * Extend `i18next` TypeScript declaration, to help autocomplete TranslateKeys
 * only requirement is to keep flat structure in l10n files,
 * this way TypeScript will infer keys
 */
declare module 'i18next' {
  interface TFunction {
    <TResult extends TFunctionResult = string>(key: TranslateKeys): TResult
  }
}

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      readonly REACT_APP_SENTRY_DSN: string
      readonly REACT_APP_SENTRY_ORGANIZATION_SLUG: string
      readonly REACT_APP_SENTRY_PROJECT_SLUG: string
      readonly REACT_APP_TILE_LAYER_URL: string
    }
  }
}
