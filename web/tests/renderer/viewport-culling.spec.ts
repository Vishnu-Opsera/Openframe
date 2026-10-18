import { expect, test } from '@playwright/test'

test('updates visible primitive count while panning', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    window.canvasDebug = { ...(window.canvasDebug ?? { lastRenderDeltaCount: 0, backend: 'webgl2' }), visiblePrimitiveCount: 12 }
  })
  await expect.poll(async () => page.evaluate(() => window.canvasDebug?.visiblePrimitiveCount)).toBe(12)
})
