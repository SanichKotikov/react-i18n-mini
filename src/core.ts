import type { ReactNode } from 'react';
import type { DateTimeOptions, I18n, I18nLocales, I18nMessage, I18nPresets, I18nValues, NumberOptions } from './types';
import { formatDateTime, formatNumber } from './format';
import { render } from './render';
import { parser } from './parser';

const subscribers = new Set<() => void>();

export const i18n: I18n = {
  language: '',
  locales: {},
  presets: {},

  setLanguage: (value: string): I18n => {
    i18n.language = value;
    [...subscribers.values()].forEach(func => func());
    return i18n;
  },
  setLocales: (value: Readonly<I18nLocales>): I18n => {
    i18n.locales = {
      ...i18n.locales,
      [i18n.language]: { ...i18n.locales[i18n.language], ...value },
    };
    [...subscribers.values()].forEach(func => func());
    return i18n;
  },
  setPresets: (presets: Readonly<I18nPresets>): I18n => {
    i18n.presets = presets;
    return i18n;
  },

  t: (msg: Readonly<I18nMessage>, props?: Readonly<I18nValues>): ReactNode => {
    return render(i18n.language, i18n.presets, parser(i18n.locales[i18n.language]?.[msg.id] || msg.message), props);
  },
  formatNumber: (value: number, options?: string | Readonly<NumberOptions>): string => {
    const optionsValue: Readonly<NumberOptions> | undefined =
      options && typeof options !== 'string' ? options : i18n.presets.number?.[options || 'default'];
    return formatNumber(value, i18n.language, optionsValue);
  },
  formatDateTime: (date: number | string | Date, options?: string | Readonly<DateTimeOptions>): string => {
    const dateValue = typeof date === 'string' ? new Date(date) : date;
    const optionsValue: Readonly<DateTimeOptions> | undefined =
      options && typeof options !== 'string' ? options : i18n.presets.dateTime?.[options || 'default'];
    return formatDateTime(dateValue, i18n.language, optionsValue);
  },
};

export function sub(callback: () => void) {
  subscribers.add(callback);

  return (): void => {
    subscribers.delete(callback);
  };
}