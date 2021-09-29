import React, { memo } from 'react';
import { useI18n } from '../context';
import { isEmpty } from '../utils';
import type { NumberOptions, NumberStyle } from '../types';

export interface NumericProps extends Omit<NumberOptions, 'style'> {
  value: number;
  preset?: string;
  numberStyle?: NumberStyle;
}

export const Numeric = memo(
  function Numeric({ value, preset, numberStyle, ...props }: Readonly<NumericProps>) {
    const { i18n } = useI18n();
    const options = { ...props, style: numberStyle };

    return (
      <>
        {i18n.formatNumber(value, !isEmpty(options)
          ? options
          : i18n.presets.number?.[preset || 'default'])}
      </>
    );
  },
);
