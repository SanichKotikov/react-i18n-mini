import React from 'react';
import TestRenderer from 'react-test-renderer';

import { render } from './render';
import type { I18nPresets, I18nValues, TemplateMessage } from './types';
import { TemplateType } from './types';

const LANG = 'en';

const PRESETS: Readonly<I18nPresets> = {
  number: {
    default: {},
    test: { minimumFractionDigits: 1 },
  },
  dateTime: {
    default: { year: 'numeric', month: 'short', day: 'numeric' },
    year: { year: 'numeric' },
  },
};

describe('render', () => {
  it('should render simple text', function() {
    expect(render(LANG, PRESETS, 'Simple text.')).toBe('Simple text.');
  });

  it('should render text with variables', function() {
    const DATE = new Date(2021, 5, 12);

    expect(render(LANG, PRESETS, ['Hello ', ['name']], { name: 'Joe' })).toBe('Hello Joe');
    expect(render(LANG, PRESETS, [['count'], ' messages'], { count: 123 })).toBe('123 messages');
    expect(render(LANG, PRESETS, [['count', TemplateType.number], ' messages'], { count: 123 })).toBe('123 messages');
    expect(render(LANG, PRESETS, [['count', TemplateType.number, 'test'], ' messages'], { count: 123 }))
      .toBe('123.0 messages');
    expect(render(LANG, PRESETS, ['Last login ', ['date']], { date: DATE })).toBe('Last login Jun 12, 2021');
    expect(render(LANG, PRESETS, ['Last login ', ['date', TemplateType.date]], { date: DATE.getTime() }))
      .toBe('Last login Jun 12, 2021');
    expect(render(LANG, PRESETS, ['Last login ', ['date', TemplateType.date, 'year']], { date: DATE }))
      .toBe('Last login 2021');
  });

  it('should render plural', function() {
    const MSG1: TemplateMessage = [['count'], ' ', ['count', TemplateType.plural, { one: 'item', other: 'items' }]];
    const MSG2: TemplateMessage = [
      [
        'count',
        TemplateType.plural,
        { '=0': 'No items', one: 'Just one item', other: ['You have ', ['count'], ' items'] },
      ], '.',
    ];

    expect(render(LANG, PRESETS, MSG1, { count: 1 })).toBe('1 item');
    expect(render(LANG, PRESETS, MSG1, { count: 2 })).toBe('2 items');

    expect(render(LANG, PRESETS, MSG2, { count: 0 })).toBe('No items.');
    expect(render(LANG, PRESETS, MSG2, { count: 1 })).toBe('Just one item.');
    expect(render(LANG, PRESETS, MSG2, { count: 2 })).toBe('You have 2 items.');
  });

  it('should render tags and components and plural', function() {
    const MSG1: TemplateMessage = ['First line.', ['br', TemplateType.tag], 'Second line.'];
    const MSG2: TemplateMessage = [
      'First line.',
      ['br', TemplateType.tag],
      'Second line with ',
      ['b', TemplateType.tag, 'highlighted text'],
      '.',
    ];
    const MSG3: TemplateMessage = [
      'Are you sure you want to delete ',
      ['b', TemplateType.tag, [['count']]],
      ' ',
      ['count', TemplateType.plural, { one: 'reply', other: 'replies' }],
      '?',
    ];

    function Comp({ message, options }: { message: TemplateMessage, options?: I18nValues }) {
      return <span>{render(LANG, PRESETS, message, options)}</span>;
    }

    expect(TestRenderer.create(<Comp message={MSG1} />).toJSON()?.['children'])
      .toEqual([
        'First line.',
        { type: 'br', props: {}, children: null },
        'Second line.',
      ]);
    expect(TestRenderer.create(<Comp message={MSG2} />).toJSON()?.['children'])
      .toEqual([
        'First line.',
        { type: 'br', props: {}, children: null },
        'Second line with ',
        { type: 'b', props: {}, children: ['highlighted text'] },
        '.',
      ]);

    expect(TestRenderer.create(<Comp message={MSG3} options={{ count: 1 }} />).toJSON()?.['children'])
      .toEqual([
        'Are you sure you want to delete ',
        { type: 'b', props: {}, children: ['1'] },
        ' ',
        'reply',
        '?',
      ]);
  });
});
