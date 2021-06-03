import { createContext, useContext } from 'react';
import type { I18n } from './types';
import { i18n } from './core';

export const I18nContext = createContext<{ i18n: I18n }>({ i18n });

export function useI18n(): Readonly<{ i18n: I18n }> {
  return useContext(I18nContext);
}
