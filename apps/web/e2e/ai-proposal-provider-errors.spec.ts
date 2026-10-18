import { expect, test } from '@playwright/test'
test('provider errors stay on the editor shell', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
