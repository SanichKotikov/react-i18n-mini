import React, { memo } from 'react';
import { useI18n } from '../context';
import { isEmpty } from '../utils';
import type { DateTimeOptions } from '../types';

export interface DateTimeProps extends DateTimeOptions {
  date: number | string | Date;
  preset?: string;
}

export const DateTime = memo<Readonly<DateTimeProps>>(
  function DateTime({ date, preset, ...options }) {
    const { _presets, formatDateTime } = useI18n();

    return (
      <>
        {formatDateTime(date, !isEmpty(options)
          ? options
          : _presets.current.dateTime?.[preset || 'default'])}
      </>
    );
  },
);
