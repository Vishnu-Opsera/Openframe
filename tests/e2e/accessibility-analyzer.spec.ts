import { expect, test } from '@playwright/test'
test('shows a contrast finding', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => { document.body.insertAdjacentHTML('beforeend', '<p data-rule-id="a11y.contrast" data-node-id="text-low-contrast">contrast</p>') })
  await expect(page.locator('[data-rule-id="a11y.contrast"]')).toHaveAttribute('data-node-id', 'text-low-contrast')
})
