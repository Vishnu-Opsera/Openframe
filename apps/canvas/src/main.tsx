import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { createI18n, I18nProvider } from './i18n'

const locale = new URLSearchParams(window.location.search).get('locale')
const resolved = createI18n(locale).locale

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element is missing.')
}

createRoot(rootElement).render(
  <StrictMode>
    <I18nProvider locale={resolved}>
      <App />
    </I18nProvider>
  </StrictMode>,
)
