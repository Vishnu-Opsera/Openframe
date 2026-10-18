import { expect, test } from '@playwright/test'
test('admin plugin shell stays available', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
