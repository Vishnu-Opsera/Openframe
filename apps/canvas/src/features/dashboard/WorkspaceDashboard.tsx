import { useI18n } from '../../i18n/index.ts'

export function LocalizedDashboard() {
  const { t } = useI18n()
  return <h1 data-testid="workspace-dashboard-title">{t('dashboard.title')}</h1>
}
