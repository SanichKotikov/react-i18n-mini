import type { ReactChild, ReactFragment } from 'react';
import React, { memo, useEffect, useState } from 'react';
import { i18n, sub } from '../core';
import { I18nContext } from '../context';

interface Props {
  children: ReactChild | ReactFragment;
}

export const I18nProvider = memo<Props>(function I18nProvider({ children }) {
  const [value, update] = useState({ i18n });
  useEffect(() => sub(() => update({ i18n })), []);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
});
