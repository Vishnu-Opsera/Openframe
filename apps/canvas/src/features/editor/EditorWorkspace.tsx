import { useI18n } from '../../i18n/index.ts'

export function LocalizedEditor() {
  const { t } = useI18n()
  return <h1 data-testid="editor-workspace-title">{t('editor.title')}</h1>
}
