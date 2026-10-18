import { expect, test } from '@playwright/test'

test('layers tree shows component and instance rows', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('layers-tree')).toBeVisible()
  await expect(page.locator('[data-layer-kind=component]')).toHaveCount(1)
})
