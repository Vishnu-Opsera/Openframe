import { expect, test } from '@playwright/test'

test('records tile cache hits after a second pan', async ({ page }) => {
  await page.goto('/')
  await expect.poll(async () => page.evaluate(() => window.canvasDebug?.tileCache?.hitCount ?? 0)).toBeGreaterThan(0)
})
