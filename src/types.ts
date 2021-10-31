import type { ReactFragment } from 'react';
import type { I18n as BaseI18n } from 'i18n-mini';

export interface I18n extends BaseI18n<string | ReactFragment> {}
