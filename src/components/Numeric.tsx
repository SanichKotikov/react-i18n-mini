import React, { memo } from 'react';
import { useI18n } from '../context';
import { NumberOptions, NumberStyle } from '../types';

interface Props extends Omit<NumberOptions, 'style'> {
  value: number;
  numberStyle?: NumberStyle;
}

export const Numeric = memo<Readonly<Props>>(function Numeric({ value, numberStyle, ...options }) {
  const { formatNumber } = useI18n();
  return <>{formatNumber(value, { ...options, style: numberStyle })}</>;
});
