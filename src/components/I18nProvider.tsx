import type { ReactChild, ReactFragment, ReactNode } from 'react';
import React, { memo, useCallback, useRef, useState } from 'react';
import type { DateTimeOptions, I18nFormats, I18nMessage, I18nMessages, I18nValues, NumberOptions } from '../types';
import { formatDateTime, formatNumber } from '../format';
import { render } from '../render';
import { parser } from '../parser';
import { I18nContext } from '../context';

interface Props {
  language: string;
  locales?: Readonly<Record<string, I18nMessages>>;
  formats?: Readonly<I18nFormats>;
  children: ReactChild | ReactFragment;
}

export const I18nProvider = memo<Props>(function I18nProvider({
  language,
  locales,
  formats,
  children,
}) {
  const [lang, setLang] = useState<string>(language);

  const _locales = useRef<Record<string, Readonly<I18nMessages>>>(locales || {});
  const _formats = useRef<Readonly<I18nFormats>>(formats || {});

  const [messages, setMessages] = useState<Readonly<I18nMessages>>(locales?.[lang] || {});

  const setLocales = useCallback((value: Readonly<I18nMessages>) => {
    _locales.current = { ..._locales.current, [lang]: { ..._locales.current[lang], ...value } };
    setMessages((state) => ({ ...state, ...value }));
  }, [lang]);

  const setLanguage = useCallback((value: string) => {
    setLang(value);
    setMessages(_locales.current[value] || {});
  }, []);

  const translate = useCallback((msg: Readonly<I18nMessage>, props?: Readonly<I18nValues>): ReactNode => {
    return render(lang, _formats.current, parser(messages[msg.id] || msg.message), props);
  }, [lang, messages]);

  const formatNum = useCallback((value: number, options?: string | Readonly<NumberOptions>): string => {
    const optionsValue: Readonly<NumberOptions> | undefined =
      options && typeof options !== 'string' ? options : _formats.current.number?.[options || 'default'];
    return formatNumber(value, lang, optionsValue);
  }, [lang]);

  const formatDate = useCallback((
    date: number | string | Date,
    options?: string | Readonly<DateTimeOptions>,
  ): string => {
    const dateValue = typeof date === 'string' ? new Date(date) : date;
    const optionsValue: Readonly<DateTimeOptions> | undefined =
      options && typeof options !== 'string' ? options : _formats.current.dateTime?.[options || 'default'];
    return formatDateTime(dateValue, lang, optionsValue);
  }, [lang]);

  return (
    <I18nContext.Provider
      value={{
        language: lang,
        locales: messages,
        _locales,
        _formats,
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
