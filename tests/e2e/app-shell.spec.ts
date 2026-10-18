import { expect, test } from '@playwright/test'

test('shared shell is visible at the root route', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="canvas-app-shell"]')).toBeVisible()
  await expect(page.locator('[data-testid="canvas-top-bar"]')).toBeVisible()
  await expect(page.locator('[data-testid="canvas-editor-host"]')).toBeVisible()
})
