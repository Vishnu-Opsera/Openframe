import { expect, test } from '@playwright/test'

for (const backend of ['webgpu', 'webgl2'] as const) {
  test(`captures ${backend} canvas output`, async ({ page }) => {
    if (backend === 'webgpu') {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'gpu', { configurable: true, value: {} })
      })
    }
    await page.goto(`/?backend=${backend}`)
    await expect(page.getByTestId('canvas-surface')).toBeVisible()
    await expect.poll(async () => page.evaluate(() => window.canvasDebug?.backend)).toBe(backend)
  })
}
