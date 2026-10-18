import { expect, test } from '@playwright/test'

test('creates text, edits an axis, and undoes', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('create-text').click()
  await page.getByTestId('text-caret').fill('2')
  await page.getByTestId('font-axis-wght').fill('500')
  await page.getByTestId('undo-edit').click()
  await expect(page.getByTestId('inspector-panel')).toBeVisible()
})
