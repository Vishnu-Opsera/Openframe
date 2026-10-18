import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/e2e/**/*.spec.ts', 'web/tests/**/*.spec.ts'],
  webServer: {
    command: 'pnpm build && pnpm exec vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    serviceWorkers: 'allow',
  },
})
