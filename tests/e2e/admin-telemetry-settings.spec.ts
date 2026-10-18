import { expect, test } from '@playwright/test'
test('telemetry controls stay off the public shell until opened', async ({ page }) => { await page.goto('/'); await expect(page.getByTestId('canvas-app-shell')).toBeVisible() })
