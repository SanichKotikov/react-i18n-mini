import type { I18nMessages, I18nRenderValue } from './types';

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isFunc(value: unknown): value is I18nRenderValue {
  return typeof value === 'function';
}

export function isEmpty<T extends object>(value: T): boolean {
  return (Object.keys(value) as (keyof T)[]).every((prop) => !value[prop]);
}

// Just an anchor for extract function
export function defineMessages<T extends I18nMessages>(messages: T): T {
  return messages;
}
