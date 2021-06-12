import type { ReactFragment } from 'react';
import { createElement } from 'react';
import type { I18nPresets, I18nValues, Template, TemplateMessage } from './types';
import { TemplateType } from './types';
import { formatDateTime, formatNumber } from './format';
import { isDate, isFunc, isNumber, isString } from './utils';

function format(
  locale: string,
  presets: Readonly<I18nPresets>,
  message: string | Template,
  props: I18nValues = {},
  key: number,
): ReactFragment | string | null {
  if (typeof message === 'string') return message;

  const [id, type, options] = message;
  const value = props[id];

  // TODO: fix types
  // https://github.com/microsoft/TypeScript/issues/37178
  switch (true) {
    case type === undefined && isNumber(value):
    case type === TemplateType.number && isNumber(value): {
      const formatOptions = isString(options) ? presets.number?.[options] : presets.number?.default;
      return formatNumber(value as number, locale, formatOptions);
    }
    case type === undefined && isDate(value):
    case type === TemplateType.date && (isString(value) || isNumber(value) || isDate(value)):
      const formatOptions = isString(options) ? presets.dateTime?.[options] : presets.dateTime?.default;
      return formatDateTime(new Date(value as number), locale, formatOptions);
    case (type === TemplateType.tag && options === undefined): {
      if (isFunc(value)) return value('');
      if (value === undefined || isString(value)) return createElement(value || id, { key });
      return null;
    }
    case (type === TemplateType.tag && options !== undefined): {
      if (isFunc(value)) return value(options as any);
      if (value === undefined || isString(value))
        return createElement(value || id, { key }, render(locale, presets, options as any, props));
      return null;
    }
    case (type === TemplateType.plural && isNumber(value) && options !== undefined): {
      // @ts-ignore
      if (value === 0 && '=0' in options) return options['=0'];

      const rule = new Intl.PluralRules(locale).select(value as number);
      // @ts-ignore
      const template = options[rule] || options.other;

      return render(locale, presets, template, props);
    }
    default:
      return String(value);
  }
}

export function render(
  locale: string,
  presets: Readonly<I18nPresets>,
  message: TemplateMessage,
  props: I18nValues = {},
): ReactFragment | string {
  if (Array.isArray(message)) {
    const result = message.map((msg: string | Template, idx: number) => (
      format(locale, presets, msg, props, idx)
    ));

    return result.every(isString) ? result.join('') : result;
  }

  return message;
}
