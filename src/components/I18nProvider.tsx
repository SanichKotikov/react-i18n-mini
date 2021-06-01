import type { ReactNode } from 'react';
import React, { memo, useCallback, useRef, useState } from 'react';
import { I18nMessage, I18nMessages, I18nValues } from '../types';
import { render } from '../render';
import { parser } from '../parser';
import { I18nContext } from '../context';

interface Props {
  language: string;
  locales?: Readonly<Record<string, I18nMessages>>;
  children: ReactNode;
}

export const I18nProvider = memo<Props>(function I18nProvider({
  language,
  locales,
  children,
}) {
  const [lang, setLang] = useState<string>(language);

  const _locales = useRef<Record<string, Readonly<I18nMessages>>>(locales || { [lang]: {} });
  const [messages, setMessages] = useState<Readonly<I18nMessages>>(locales?.[lang] || {});

  const t = useCallback((msg: Readonly<I18nMessage>, props?: Readonly<I18nValues>): ReactNode => {
    return render(lang, parser(messages[msg.id] || msg.message), props);
  }, [lang, messages]);

  const setLocales = useCallback((value: Readonly<I18nMessages>) => {
    _locales.current = { ..._locales.current, [lang]: { ..._locales.current[lang], ...value } };
    setMessages((state) => ({ ...state, ...value }));
  }, [lang]);

  const setLanguage = useCallback((value: string) => {
    setLang(value);
    setMessages(_locales.current[value] || {});
  }, []);

  return (
    <I18nContext.Provider
      value={{
        language: lang,
        locales: messages,
        _locales,
        setLanguage,
        setLocales,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
});
