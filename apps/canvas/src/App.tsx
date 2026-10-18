import { useI18n } from './i18n'

export function App() {
  const i18n = useI18n()
  return (
    <div data-testid="app-locale-root" dir={i18n.dir} lang={i18n.locale}>
      <h1>{i18n.t('app.name')}</h1>
    </div>
  )
}
