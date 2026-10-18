import { expect, test } from '@playwright/test'
test('guardian finding can be shown', async ({ page }) => { await page.goto('/'); await page.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<p data-rule-id="guardian.off_token_color">drift</p>')); await expect(page.locator('[data-rule-id="guardian.off_token_color"]')).toBeVisible() })
