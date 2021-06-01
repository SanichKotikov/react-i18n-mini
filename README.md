# react-i18n-mini

A tiny (~1.38 kB) internationalization library for React.

```bash
npm i -S react-i18n-mini
```

## Text

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
  message="{count, plural, =0 {No items} one {You have one item} other {You have {count} items}}."
  count={19999}
/>
```

#### Date Formatting

```typescript jsx
<Text
  id="some.id"
  message="Last login {date}"
  date={new Date()}
/>
```

Note: use `{date, date}` for number or string value.

## useI18n

```typescript jsx
export { useI18n } from 'react-i18n-mini';

function SomeComp() {
  const { t } = useI18n();
  return <h1>{t({ id: "some_page.title", message: "Page title" })}</h1>
}
```
