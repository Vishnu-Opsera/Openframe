import { expect, test } from '@playwright/test'

test('layout inspector applies flex and reports the child position', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('enable-flex').click()
  await expect(page.getByTestId('layout-child-x')).toHaveText('8')
})
