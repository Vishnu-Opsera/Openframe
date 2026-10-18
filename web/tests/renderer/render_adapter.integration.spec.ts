import { expect, test } from '@playwright/test'

test('scene initialization records render deltas', async ({ page }) => {
  await page.goto('/')
  await expect.poll(async () => page.evaluate(() => window.canvasDebug?.lastRenderDeltaCount ?? 0)).toBeGreaterThan(0)
})
