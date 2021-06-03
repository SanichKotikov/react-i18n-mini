import type { I18nMessages, I18nRenderValue, I18nValue } from './types';

export function isNumber(value: I18nValue): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isDate(value: I18nValue): value is Date {
  return value instanceof Date;
}

export function isFunc(value: I18nValue): value is I18nRenderValue {
  return typeof value === 'function';
}

export function isEmpty<T extends object>(value: T): boolean {
  return (Object.keys(value) as (keyof T)[]).every((prop) => !value[prop]);
}

// Just an anchor for extract function
export function defineMessages<T extends I18nMessages, K extends keyof T>(messages: T): T {
  return messages;
}
