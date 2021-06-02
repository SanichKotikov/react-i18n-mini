# react-i18n-mini

A tiny (~1.82 kB) internationalization library for React.

```bash
npm i -S react-i18n-mini
```

## Usage

#### Displaying Messages

```typescript jsx
export { I18nProvider, Text } from 'react-i18n-mini';

function App() {
  return (
    <I18nProvider language="en">
      <Text
        id="app.sample_message"
        message="Read the <link>documentation</link> for more info."
        link={(text) => <a href="https://github.com/SanichKotikov/react-i18n-mini">{text}</a>}
      />
    </I18nProvider>
  )
}
```

#### Plural Formatting

```typescript jsx
<Text
  id="some.id"
  message="{count, plural, =0 {No items} one {One item} other {{count} items}}."
  count={19999}
/>
```

#### Date Formatting

```typescript jsx
<Text
  id="some.id"
  message="Last login {datetime}"
  datetime={new Date()}
/>

<DateTime
  date={new Date()}
  day="numeric"
  month="long"
  weekday="long"
  year="numeric"
/>
```

Note: use `{datetime, date}` for number or string values.

#### Number Formatting

```typescript jsx
<Numeric
  value={9.99}
  numberStyle="currency"
  currency="EUR"
/>
```

#### useI18n

```typescript jsx
export { useI18n } from 'react-i18n-mini';

function SomeComp() {
  const { t, formatNumber, formatDateTime } = useI18n();

  return (
    <div>
      <h1>{t({ id: "some_page.title", message: "Page title" })}</h1>
      <div>{formatNumber(99999.9, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div>{formatDateTime(new Date(), { day: '2-digit', month: 'short' })}</div>
    </div>
  );
}
```

#### Define Messages

```typescript jsx
export { useI18n, defineMessages } from 'react-i18n-mini';

const messages = defineMessages({
  title: { id: "some_page.title", message: "Page title" },
});

function SomeComp() {
  const { t } = useI18n();
  return <h1>{t(messages.title)}</h1>;
}
```

#### Using Presets

```typescript jsx
export { I18nPresets, I18nProvider, Text } from 'react-i18n-mini';

const PRESETS: I18nPresets = {
  number: {
    default: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
    fraction: { minimumFractionDigits: 2 },
  },
  dateTime: {
    default: { day: 'numeric', month: 'short', year: 'numeric' },
    full: { day: 'numeric', month: 'long', year: 'numeric' },
    simple: { day: 'numeric', month: 'short' },
  },
};

function App() {
  return (
    <I18nProvider language="en" presets={PRESETS}>
      <Text
        id="app.sample_message"
        message="Some value: {count, number, fraction}"
        count={999}
      />
    </I18nProvider>
  )
}
```

```typescript jsx
<div>{formatNumber(9999, 'fraction')}</div>
<DateTime date={new Date()} preset="simple" />
```
