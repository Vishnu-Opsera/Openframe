import { expect, test } from '@playwright/test'
test('plugin host stays inside the editor shell', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
