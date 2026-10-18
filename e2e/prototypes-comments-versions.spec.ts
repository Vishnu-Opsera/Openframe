import { expect, test } from '@playwright/test'

test('workspace shows prototype, comment, and version panels', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('prototype-panel')).toBeVisible()
  await expect(page.getByTestId('comment-drawer')).toBeVisible()
  await page.getByTestId('restore-version').click()
  await expect(page.getByTestId('version-history-panel')).toBeVisible()
  await expect(page.locator('[data-kind]')).toHaveCount(0)
})
