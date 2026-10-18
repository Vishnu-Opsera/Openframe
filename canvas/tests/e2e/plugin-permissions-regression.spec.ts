import { expect, test } from '@playwright/test'
test('permission regression stays in the shell', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
