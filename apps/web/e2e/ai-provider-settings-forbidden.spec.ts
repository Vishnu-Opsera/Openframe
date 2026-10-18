import { expect, test } from '@playwright/test'
test('forbidden settings stay off the editor shell', async ({ page }) => { await page.goto('/'); await expect(page.locator('form[aria-label="Provider configuration"]')).toHaveCount(0) })
