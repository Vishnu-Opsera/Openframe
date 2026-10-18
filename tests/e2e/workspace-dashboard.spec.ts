import { expect, test } from '@playwright/test'

test('workspace switcher changes the visible workspace without file or network actions', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('file-action-create')).toBeDisabled()
  await expect(page.getByTestId('file-action-open')).toBeDisabled()
  await expect(page.getByTestId('file-action-import')).toBeDisabled()
  await page.getByTestId('workspace-switcher').selectOption('ws-studio')
  await expect(page.getByTestId('workspace-name')).toHaveText('Studio System')
})
