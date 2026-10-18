import { expect, test } from '@playwright/test'
test('export model route is represented by the shell', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
