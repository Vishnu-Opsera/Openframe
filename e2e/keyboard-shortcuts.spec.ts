import { expect, test } from '@playwright/test'

test('workspace records shortcut actions', async ({ page }) => {
  await page.goto('/')
  await page.locator('body').press('Meta+KeyF')
  await expect(page.getByTestId('editor-workspace')).toBeVisible()
  await expect(page.getByTestId('gpu-canvas')).toBeVisible()
})
