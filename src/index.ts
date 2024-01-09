import type { ReactFragment } from 'react';
import { createElement, Children, Fragment } from 'react';
import type { I18nOptions } from 'i18n-mini';
import type { I18nMessage, I18nValues } from 'i18n-mini/lib/types';
import { createI18n as create } from 'i18n-mini';
import type { I18nReturn } from 'i18n-mini/lib/core';

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
  return createElement(tag, null, child);
}

type TFormatType = string | ReactFragment;

export function createI18n(options: Omit<I18nOptions, 'formatTag'>): Readonly<I18nReturn<TFormatType>> {
  const { i18n, subscribe } = create<TFormatType>({ ...options, formatTag });

  return {
    i18n: {
      ...i18n,
      t: (message: string | I18nMessage, values?: Readonly<I18nValues>): TFormatType | TFormatType[] => {
        const result = i18n.t(message, values);

        return Array.isArray(result)
          ? Children.map(result, (child, index) => createElement(Fragment, { key: index }, child))
          : result;
      },
    },
    subscribe,
  };
}
