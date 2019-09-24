/// <reference types="@winify/react-scripts" />
import { TFunctionResult, TFunctionKeys, TOptions } from 'i18next'
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
