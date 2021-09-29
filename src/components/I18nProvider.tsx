import type { ReactChild, ReactFragment } from 'react';
import React, { memo, useEffect, useState } from 'react';
import type { I18n, SubscribeFunc } from '../types';
import { I18nContext } from '../context';

interface Props {
  i18n: I18n;
  subscribe: SubscribeFunc;
  children: ReactChild | ReactFragment;
}

export const I18nProvider = memo(function I18nProvider({ i18n, subscribe, children }: Readonly<Props>) {
  const [value, update] = useState({ i18n });
  useEffect(() => subscribe(() => update({ i18n })), [i18n, subscribe]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
});
