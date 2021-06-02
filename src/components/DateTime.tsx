import React, { memo } from 'react';
import { useI18n } from '../context';
import type { DateTimeOptions } from '../types';

interface Props extends DateTimeOptions {
  date: number | string | Date;
}

export const DateTime = memo<Readonly<Props>>(function DateTime({ date, ...options }) {
  const { formatDateTime } = useI18n();
  return <>{formatDateTime(date, options)}</>;
});
