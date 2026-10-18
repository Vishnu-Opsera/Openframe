import { expect, test } from '@playwright/test'

for (const locale of ['en-US', 'ar-EG']) {
  test(`shell stays left to right for ${locale}`, async ({ page }) => {
    await page.goto(`/?locale=${locale}`)
    const root = page.getByTestId('app-locale-root')
    await expect(root).toBeVisible()
    await expect(root).toHaveAttribute('dir', 'ltr')
  })
}
