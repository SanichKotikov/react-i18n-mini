import React, { memo } from 'react';
import { useI18n } from '../context';
import { I18nMessage, I18nValues } from '../types';

type Props = Readonly<I18nMessage> & Readonly<I18nValues>;

export const Text = memo<Props>(function Text({ id, message, ...props }) {
  const { t } = useI18n();
  return <>{t({ id, message }, props)}</>;
});
