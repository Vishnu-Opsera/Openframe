import { expect, test } from '@playwright/test'
test('admin settings page shell is reachable', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
