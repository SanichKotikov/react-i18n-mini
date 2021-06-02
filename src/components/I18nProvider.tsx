import type { ReactChild, ReactFragment, ReactNode } from 'react';
import React, { memo, useCallback, useRef, useState } from 'react';
import type { DateTimeOptions, I18nLocales, I18nMessage, I18nPresets, I18nValues, NumberOptions } from '../types';
import { formatDateTime, formatNumber } from '../format';
import { render } from '../render';
import { parser } from '../parser';
import { I18nContext } from '../context';

interface Props {
  language: string;
  locales?: Readonly<Record<string, I18nLocales>>;
  presets?: Readonly<I18nPresets>;
  children: ReactChild | ReactFragment;
}

export const I18nProvider = memo<Props>(function I18nProvider({
  language,
  locales,
  presets,
  children,
}) {
  const [lang, setLang] = useState<string>(language);

  const _locales = useRef<Record<string, Readonly<I18nLocales>>>(locales || {});
  const _presets = useRef<Readonly<I18nPresets>>(presets || {});

  const [messages, setMessages] = useState<Readonly<I18nLocales>>(locales?.[lang] || {});

  const setLocales = useCallback((value: Readonly<I18nLocales>) => {
    _locales.current = { ..._locales.current, [lang]: { ..._locales.current[lang], ...value } };
    setMessages((state) => ({ ...state, ...value }));
  }, [lang]);

  const setLanguage = useCallback((value: string) => {
    setLang(value);
    setMessages(_locales.current[value] || {});
  }, []);

  const translate = useCallback((msg: Readonly<I18nMessage>, props?: Readonly<I18nValues>): ReactNode => {
    return render(lang, _presets.current, parser(messages[msg.id] || msg.message), props);
  }, [lang, messages]);

  const formatNum = useCallback((value: number, options?: string | Readonly<NumberOptions>): string => {
    const optionsValue: Readonly<NumberOptions> | undefined =
      options && typeof options !== 'string' ? options : _presets.current.number?.[options || 'default'];
    return formatNumber(value, lang, optionsValue);
  }, [lang]);

  const formatDate = useCallback((
    date: number | string | Date,
    options?: string | Readonly<DateTimeOptions>,
  ): string => {
    const dateValue = typeof date === 'string' ? new Date(date) : date;
    const optionsValue: Readonly<DateTimeOptions> | undefined =
      options && typeof options !== 'string' ? options : _presets.current.dateTime?.[options || 'default'];
    return formatDateTime(dateValue, lang, optionsValue);
  }, [lang]);

  return (
    <I18nContext.Provider
      value={{
        language: lang,
        locales: messages,
        _locales,
        _presets,
        setLanguage,
        setLocales,
        t: translate,
        formatNumber: formatNum,
        formatDateTime: formatDate,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
});
