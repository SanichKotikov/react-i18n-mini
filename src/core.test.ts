import { createI18n } from './core';

describe('core', () => {
  it('should set language', function() {
    const { i18n } = createI18n({ language: 'en' });
    expect(i18n.language).toBe('en');

    const result = i18n.setLanguage('ru');
    expect(i18n.language).toBe('ru');
    expect(i18n === result).toBeTruthy();
  });

  it('should set locales', function() {
    const locales = { en: { id: 'message' } };
    const { i18n } = createI18n({ language: 'en', locales });
    expect(i18n.locales).toEqual(locales);
    expect(i18n.locales === locales).toBeFalsy();

    const otherLocales = { some: 'other message' };
    const result = i18n.setLocales(otherLocales);
    expect(i18n.locales).toEqual({ en: { ...locales.en, ...otherLocales } });
    expect(i18n === result).toBeTruthy();
  });

  it('should call subscribers', function() {
    const { i18n, subscribe } = createI18n({ language: 'en' });
    const subscriber = jest.fn();
    const unsub = subscribe(subscriber);

    i18n.setLanguage('ru');
    expect(subscriber.mock.calls.length).toBe(1);
    unsub();

    i18n.setLanguage('en');
    expect(subscriber.mock.calls.length).toBe(1);
  });

  it('should format number', function() {
    const { i18n } = createI18n({
      language: 'en',
      presets: {
        number: {
          default: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
          fraction: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
        },
      },
    });

    expect(i18n.formatNumber(9999.99)).toBe('10,000');
    expect(i18n.formatNumber(9999.99, 'fraction')).toBe('9,999.99');
    expect(i18n.formatNumber(9.99, { style: 'currency', currency: 'EUR' })).toBe('€9.99');
  });

  it('should format date', function() {
    const date = new Date(2021, 5, 22, 1, 0, 0, 0);
    const { i18n } = createI18n({
      language: 'en',
      presets: {
        dateTime: {
          default: { day: 'numeric', month: 'short', year: 'numeric' },
          full: { day: 'numeric', month: 'long', year: 'numeric' },
          simple: { day: 'numeric', month: 'short' },
        },
      },
    });

    expect(i18n.formatDateTime(date)).toBe('Jun 22, 2021');
    expect(i18n.formatDateTime(date, 'full')).toBe('June 22, 2021');
    expect(i18n.formatDateTime(date, 'simple')).toBe('Jun 22');
  });

  it('should translate', function() {
    const lang = 'ru';
    const id = 'test';

    const message = 'Test string';
    const translated = 'Тестовая строка';

    const { i18n } = createI18n({ language: 'en', locales: { [lang]: { [id]: translated } } });
    expect(i18n.t({ id, message })).toBe(message);
    i18n.setLanguage(lang);
    expect(i18n.t({ id, message })).toBe(translated);
  });
});
