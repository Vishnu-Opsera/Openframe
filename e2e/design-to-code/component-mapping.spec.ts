import { expect, test } from '@playwright/test'
test('component mapping shell stays available', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
