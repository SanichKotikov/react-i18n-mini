import React, { memo } from 'react';
import { useI18n } from '../context';
import { isEmpty } from '../utils';
import type { NumberOptions, NumberStyle } from '../types';

interface Props extends Omit<NumberOptions, 'style'> {
  value: number;
  numberStyle?: NumberStyle;
}

export const Numeric = memo<Readonly<Props>>(function Numeric({ value, numberStyle, ...props }) {
  const { _formats, formatNumber } = useI18n();
  const options = { ...props, style: numberStyle };

  return <>{formatNumber(value, !isEmpty(options) ? options : _formats.current.number?.default)}</>;
});
