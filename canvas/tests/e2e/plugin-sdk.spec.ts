import { expect, test } from '@playwright/test'
test('sdk host stays in the shell', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
