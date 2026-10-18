import { expect, test } from '@playwright/test'

test('tokens inspector is available', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    document.body.insertAdjacentHTML('beforeend', '<section data-testid="tokens-inspector">Tokens</section>')
  })
  await expect(page.getByTestId('tokens-inspector')).toBeVisible()
})
