import type { ReactFragment } from 'react';
import { createElement } from 'react';
import type { I18nPresets, I18nValues, Template, TemplateMessage } from './types';
import { TemplateType } from './types';
import { formatDateTime, formatNumber } from './format';
import { getPreset, isDate, isFunc, isNumber, isPlural, isString } from './utils';

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

  if (isNumber(value) && (!type || type === TemplateType.number))
    return formatNumber(value, locale, getPreset(presets.number, options));

  else if (isDate(value) || ((isString(value) || isNumber(value)) && type === TemplateType.date))
    return formatDateTime(new Date(value), locale, getPreset(presets.dateTime, options));

  else if (type === TemplateType.tag) {
    const child = isString(options) ? options : '';
    if (isFunc(value)) return value(child);

    return createElement(
      isString(value) ? value : id,
      { key },
      isString(options)
        ? render(locale, presets, options, props)
        : undefined,
    );
  }

  else if (type === TemplateType.plural && isNumber(value) && isPlural(options)) {
    if (value === 0 && options['=0']) return options['=0'];

    const rule = new Intl.PluralRules(locale).select(value);
    const template = options[rule] || options.other || '';
    return render(locale, presets, template, props);
  }

  else return String(value);
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
