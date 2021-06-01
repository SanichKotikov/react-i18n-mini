import { TemplateMessage, TemplateType } from './types';
import { parser } from './parser';

describe('parser', () => {
  it('should parse text', function() {
    expect(parser('Simple text.')).toBe<TemplateMessage>('Simple text.');
  });

  it('should parse numbers', function() {
    expect(parser('Hello {name}')).toEqual<TemplateMessage>(['Hello ', ['name']]);
    expect(parser('{count} messages')).toEqual<TemplateMessage>([['count'], ' messages']);
    expect(parser('{count, number} messages')).toEqual<TemplateMessage>([['count', TemplateType.number], ' messages']);
    expect(parser('Last login {date}')).toEqual<TemplateMessage>(['Last login ', ['date']]);
    expect(parser('Last login {date, date}')).toEqual<TemplateMessage>(['Last login ', ['date', TemplateType.date]]);
  });

  it('should parse plural', function() {
    expect(parser('{count} {count, plural, one {item} other {items}}'))
      .toEqual<TemplateMessage>([['count'], ' ', ['count', TemplateType.plural, { one: 'item', other: 'items' }]]);

    expect(parser('{count, number} {count, plural, one {item} other {items}}'))
      .toEqual<TemplateMessage>([
        ['count', TemplateType.number], ' ', [
          'count', TemplateType.plural, {
            one: 'item',
            other: 'items',
          },
        ],
      ]);

    expect(parser('{count, plural, =0 {no items} one {1 item} other {{count} items}}'))
      .toEqual<TemplateMessage>([
        [
          'count', TemplateType.plural, {
          '=0': 'no items',
          one: '1 item',
          other: [['count'], ' items'],
        },
        ],
      ]);
  });

  it('should parse tags', function() {
    expect(parser('<b>Few</b> messages')).toEqual<TemplateMessage>([['b', TemplateType.tag, 'Few'], ' messages']);
    expect(parser('<link>Click here</link> to get more information.'))
      .toEqual<TemplateMessage>([['link', TemplateType.tag, 'Click here'], ' to get more information.']);
    expect(parser('<b>{count}</b> messages')).toEqual<TemplateMessage>([
      ['b', TemplateType.tag, [['count']]],
      ' messages',
    ]);
  });

  it('should parse tags & plurals', function() {
    expect(parser('Show <b>{count} {count, plural, one {item} other {items}}</b> in row.'))
      .toEqual<TemplateMessage>([
        'Show ', [
          'b', TemplateType.tag, [
            ['count'], ' ', [
              'count', TemplateType.plural, {
                one: 'item',
                other: 'items',
              },
            ],
          ],
        ], ' in row.',
      ]);
  });
});
