import { expect, test } from '@playwright/test'

test('editor core becomes ready without a load failure', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  await page.goto('/')
  await expect(page.getByTestId('editor-core-ready')).toBeVisible()
  expect(errors.some((error) => error.includes('editor-core load failed'))).toBe(false)
})
