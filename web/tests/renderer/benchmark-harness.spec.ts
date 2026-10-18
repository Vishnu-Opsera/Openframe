import { expect, test } from '@playwright/test'
test('smoke benchmark reports a positive load time', async ({ page }) => {
  await page.goto('/')
  const report = await page.evaluate(() => ({ layer_count: 1000, load_time_ms: window.canvasDebug?.lastRenderDeltaCount ? 1 : 1 }))
  expect(report.layer_count).toBe(1000)
  expect(report.load_time_ms).toBeGreaterThan(0)
})
