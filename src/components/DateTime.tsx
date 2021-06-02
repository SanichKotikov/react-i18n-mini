import React, { memo } from 'react';
import { useI18n } from '../context';
import { isEmpty } from '../utils';
import type { DateTimeOptions } from '../types';

interface Props extends DateTimeOptions {
  date: number | string | Date;
}

export const DateTime = memo<Readonly<Props>>(function DateTime({ date, ...options }) {
  const { _formats, formatDateTime } = useI18n();
  return <>{formatDateTime(date, !isEmpty(options) ? options : _formats.current.dateTime?.default)}</>;
});
