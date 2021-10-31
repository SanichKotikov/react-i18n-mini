import type { ReactFragment } from 'react';
import { createElement } from 'react';
import type { I18nOptions } from 'i18n-mini';
import { createI18n as create } from 'i18n-mini';

export { useI18n } from './context';
export { I18nProvider } from './components/I18nProvider';
export { Text } from './components/Text';
export { Numeric } from './components/Numeric';
export { DateTime } from './components/DateTime';

export { defineMessages } from 'i18n-mini';
export type { I18nPresets } from 'i18n-mini';

export type { TextProps } from './components/Text';
export type { NumericProps } from './components/Numeric';
export type { DateTimeProps } from './components/DateTime';
export type { I18n } from './types';

function formatTag(tag: string, child: string | string[] | undefined) {
  return createElement(tag, { key: tag }, child);
}

export function createI18n(options: Omit<I18nOptions, 'formatTag'>) {
  return create<string | ReactFragment>({ ...options, formatTag });
}
