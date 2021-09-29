import React, { memo } from 'react';
import { useI18n } from '../context';
import { isEmpty } from '../utils';
import type { DateTimeOptions } from '../types';

export interface DateTimeProps extends DateTimeOptions {
  date: number | string | Date;
  preset?: string;
}

export const DateTime = memo(
  function DateTime({ date, preset, ...options }: Readonly<DateTimeProps>) {
    const { i18n } = useI18n();

    return (
      <>
        {i18n.formatDateTime(date, !isEmpty(options)
          ? options
          : i18n.presets.dateTime?.[preset || 'default'])}
      </>
    );
  },
);
