import React, { memo } from 'react';
import { useI18n } from '../context';
import type { I18nMessage, I18nValues } from '../types';

export type TextProps = I18nMessage & I18nValues;

export const Text = memo(
  function Text({ id, message, ...props }: Readonly<TextProps>) {
    const { i18n } = useI18n();
    return <>{i18n.t({ id, message }, props)}</>;
  },
);
