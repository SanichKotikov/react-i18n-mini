import { createContext, useContext } from 'react';
import type { I18n } from './types';
import { noop } from './utils';

export const I18nContext = createContext<I18n>({
  language: '',
  locales: {},
  _locales: { current: {} },
  setLanguage: noop(),
  setLocales: noop(),
  t: noop(''),
});

export function useI18n(): Readonly<I18n> {
  return useContext(I18nContext);
}
