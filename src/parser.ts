import type { Template, TemplateMessage, TemplatePlural } from './types';
import { TemplateType } from './types';

const VAR_KEY = 'var';
const WRAPPER = '%%%';

const TYPES = 'number|plural|date';
const PLURAL_RILES = '=0|zero|one|two|few|many|other';

const PLURAL_ALL_REGEXP = new RegExp(`(${PLURAL_RILES})`, 'g');
const PLURAL_ITEM_REGEXP = new RegExp(`^(${PLURAL_RILES})\\s{(.+?)}$`);

const TAG_ALL_REGEXP = /<(\w+?)>(.+?)<\/\w+?>/g;
const TAG_ITEM_REGEXP = /^<(\w+?)>(.+?)<\/\w+?>$/;

const TPL_ALL_REGEXP = new RegExp(`{(\\w+?)(, (${TYPES})(, ((${PLURAL_RILES}) {.+?}+|\\w+?)|)|)}`, 'g');
const TPL_ITEM_REGEXP = new RegExp(`^{(\\w+?)(?:, (${TYPES})(?:, ((?:${PLURAL_RILES}) {.+?}+|\\w+?)|)|)}$`);

function splitMessage(
  message: string,
  matches: RegExpMatchArray,
  mapFunc: (match: string, val: string) => string | Template,
): TemplateMessage {
  return matches
    .reduce((acc, match, idx) => acc.replace(match, `${WRAPPER}${VAR_KEY}${idx}${WRAPPER}`), message)
    .split(WRAPPER)
    .filter(val => val !== '')
    .map((val: string) => {
      const m = val.match(new RegExp(`^${VAR_KEY}(\\d+?)$`));
      if (!m || !m[1]) return val;

      // TODO: fix types
      return mapFunc(matches[m[1] as any], val);
    });
}

// TODO: fix types
function trimArray(arr: Template): Template {
  return arr.reduceRight((acc: any[], item) => {
    return (!item && !acc.length) ? acc : [item, ...acc];
  }, []) as Template;
}

function isRuleMatch(match: RegExpMatchArray | null): match is [string, Intl.LDMLPluralRule, string] {
  return match !== null && match.length === 3;
}

function parsePlural(value: string): Readonly<TemplatePlural> {
  return value
    .replace(PLURAL_ALL_REGEXP, '\n$1')
    .split('\n')
    .map(val => val.trim().match(PLURAL_ITEM_REGEXP))
    .filter(isRuleMatch)
    .reduce<TemplatePlural>((acc, item) => {
      acc[item[1]] = parser(item[2]);
      return acc;
    }, {});
}

export function parser(message: string): TemplateMessage {
  const result: TemplateMessage = [message]
    .map(value => {
      const matches = value.match(TAG_ALL_REGEXP);
      if (!matches) return value;

      return splitMessage(value, matches, (match: string, val: string) => {
        const tpl = match.match(TAG_ITEM_REGEXP);
        if (!tpl) return val;

        const [key, text] = [...tpl].filter(Boolean).slice(1);
        return trimArray([key, TemplateType.tag, parser(text)]);
      });
    })
    .map(value => {
      if (typeof value !== 'string') return value;

      const matches = value.match(TPL_ALL_REGEXP);
      if (!matches) return value;

      return splitMessage(value, matches, (match: string, val: string) => {
        const tpl = match.match(TPL_ITEM_REGEXP);
        if (!tpl) return val;

        // TODO: fix types
        const [name, type, value] = [...tpl].filter(Boolean).slice(1) as [string, TemplateType, string];
        return trimArray([name, type, type === 'plural' ? parsePlural(value) : value]);
      });
    })
    .flat();

  return (result.length === 1 && typeof result[0] === 'string') ? result[0] : result;
}
