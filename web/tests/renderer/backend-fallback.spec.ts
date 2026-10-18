import { expect, test } from '@playwright/test'

test('falls back to webgl2 when webgpu is absent', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'gpu', { configurable: true, value: undefined })
  })
  await page.goto('/')
  await expect.poll(async () => page.evaluate(() => window.canvasDebug?.backend)).toBe('webgl2')
})
