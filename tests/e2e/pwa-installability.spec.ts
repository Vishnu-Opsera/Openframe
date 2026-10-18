import { expect, test } from '@playwright/test'

test('manifest and service worker are available after reload', async ({ page }) => {
  await page.goto('/')
  const manifest = await page.request.get('/manifest.webmanifest')
  expect(manifest.status()).toBe(200)

  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await expect(page.locator('[data-testid="canvas-app-shell"]')).toBeVisible()
})
