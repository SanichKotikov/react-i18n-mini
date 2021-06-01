import type { MutableRefObject, ReactChild, ReactFragment, ReactNode } from 'react';

export enum TemplateType {
  number = 'number',
  plural = 'plural',
  date = 'date',
  tag = 'tag',
}

export type TemplatePlural = Partial<Record<Intl.LDMLPluralRule | '=0', TemplateMessage>>;
export type Template = [name: string, type?: TemplateType, options?: string | TemplatePlural | TemplateMessage];
export type TemplateMessage = string | readonly  (string | Template)[];

export type I18nRenderValue = (child: string) => ReactChild | ReactFragment;
export type I18nValue = number | string | Date | I18nRenderValue;

export interface I18nValues {
  [key: string]: I18nValue;
}

export interface I18nMessages {
  [key: string]: string;
}

export interface I18nMessage {
  id: string;
  message: string;
}

export interface I18n {
  language: string;
  locales: Readonly<I18nMessages>;
  _locales: MutableRefObject<Readonly<Record<string, I18nMessages>>>;
  setLanguage: (language: string) => void;
  setLocales: (locales: I18nMessages) => void;
  t: (message: I18nMessage, values?: Readonly<I18nValues>) => ReactNode;
}
