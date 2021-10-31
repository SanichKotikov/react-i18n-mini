import React, { memo } from 'react';
import { isEmpty } from 'i18n-mini/lib/utils';
import type { DateTimeOptions } from 'i18n-mini/lib/types';
import { useI18n } from '../context';

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
