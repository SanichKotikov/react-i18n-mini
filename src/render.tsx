import type { ReactNode } from 'react';
import React, { createElement, Fragment } from 'react';
import type { I18nValues, Template, TemplateMessage } from './types';
import { TemplateType } from './types';
import { formatDateTime, formatNumber } from './format';
import { isDate, isFunc, isNumber, isString } from './utils';

function format(
  locale: string,
  message: string | Template,
  props: I18nValues = {},
): ReactNode {
  if (typeof message === 'string') return message;

  const [key, type, options] = message;
  const value = props[key];

  // TODO: fix types
  // https://github.com/microsoft/TypeScript/issues/37178
  switch (true) {
    case type === undefined && isNumber(value):
    case type === TemplateType.number && isNumber(value): {
      return formatNumber(value as number, locale); // TODO options
    }
    case type === undefined && isDate(value):
    case type === TemplateType.date && (isString(value) || isNumber(value) || isDate(value)):
      return formatDateTime(new Date(value as number), locale); // TODO options
    case (type === TemplateType.tag && options !== undefined): {
      if (isFunc(value)) return value(options as any);
      if (isString(value)) return createElement(value, null, render(locale, options as any, props));
      return null;
    }
    case (type === TemplateType.plural && isNumber(value) && options !== undefined): {
      // @ts-ignore
      if (value === 0 && '=0' in options) return options['=0'];

      const rule = new Intl.PluralRules(locale).select(value as number);
      // @ts-ignore
      const template = options[rule] || options.other;

      return render(locale, template, props);
    }
    default:
      return String(value);
  }
}

export function render(locale: string, message: TemplateMessage, props: I18nValues = {}): ReactNode {
  return Array.isArray(message)
    ? message.map((msg: string | Template, idx: number) => <Fragment key={idx}>{format(locale, msg, props)}</Fragment>)
    : message;
}
