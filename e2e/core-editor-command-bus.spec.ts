import { expect, test } from '@playwright/test'

test('toolbar dispatches a frame command onto the canvas surface', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('create-frame').click()
  await expect(page.getByTestId('gpu-canvas')).toBeVisible()
  await expect(page.locator('[data-kind="frame"]')).toHaveCount(0)
})
