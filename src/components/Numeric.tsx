import React, { memo } from 'react';
import { useI18n } from '../context';
import { isEmpty } from '../utils';
import type { NumberOptions, NumberStyle } from '../types';

interface Props extends Omit<NumberOptions, 'style'> {
  value: number;
  preset?: string;
  numberStyle?: NumberStyle;
}

export const Numeric = memo<Readonly<Props>>(function Numeric({ value, preset, numberStyle, ...props }) {
  const { _presets, formatNumber } = useI18n();
  const options = { ...props, style: numberStyle };

  return <>{formatNumber(value, !isEmpty(options) ? options : _presets.current.number?.[preset || 'default'])}</>;
});
