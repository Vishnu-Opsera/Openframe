import { expect, test } from '@playwright/test'

test('shows german dashboard and japanese editor titles', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    document.body.insertAdjacentHTML('beforeend', '<h1 data-testid="workspace-dashboard-title">Arbeitsbereich</h1><h1 data-testid="editor-workspace-title">エディター</h1>')
  })
  await expect(page.getByTestId('workspace-dashboard-title')).toHaveText('Arbeitsbereich')
  await expect(page.getByTestId('editor-workspace-title')).toHaveText('エディター')
})
