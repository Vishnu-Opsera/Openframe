import { expect, test } from '@playwright/test'

test('selects webgpu when navigator.gpu exists', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'gpu', { configurable: true, value: { requestAdapter: () => Promise.resolve(null) } })
  })
  await page.goto('/')
  await expect.poll(async () => page.evaluate(() => window.canvasDebug?.backend)).toBe('webgpu')
})
