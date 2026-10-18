import { expect, test } from '@playwright/test'
test('react export shell stays available', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
