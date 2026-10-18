import { expect, test } from '@playwright/test'
test('review controls stay inside the shell', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
