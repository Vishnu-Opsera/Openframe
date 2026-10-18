import { expect, test } from '@playwright/test'
test('multi target export shell stays available', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
