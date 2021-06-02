import type { I18nRenderValue, I18nValue } from './types';

export function noop(): () => undefined;
export function noop<T>(returnValue: T): () => T;
export function noop(returnValue?: any) {
  return () => returnValue;
}

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
