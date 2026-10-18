import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from '../apps/canvas/src/i18n'
import { App } from './App'
import { registerServiceWorker } from './pwa/registerServiceWorker'
import './styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element is missing from index.html.')
}

const locale = new URLSearchParams(window.location.search).get('locale')

createRoot(rootElement).render(
  <StrictMode>
    <I18nProvider locale={locale}>
      <App />
    </I18nProvider>
  </StrictMode>,
)

void registerServiceWorker()
