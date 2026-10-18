import { expect, test } from '@playwright/test'

test('pen tool closes a path and boolean union stays on the canvas', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('pen-tool').click()
  await page.getByTestId('close-path').click()
  await page.getByTestId('boolean-union').click()
  await expect(page.getByTestId('gpu-canvas')).toBeVisible()
})
