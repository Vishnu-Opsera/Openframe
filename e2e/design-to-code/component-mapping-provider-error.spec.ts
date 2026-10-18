import { expect, test } from '@playwright/test'
test('missing provider stays on the shell', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
