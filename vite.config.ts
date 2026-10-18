/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts', 'apps/canvas/**/*.test.ts', 'apps/canvas/**/*.test.tsx', 'apps/web/**/*.spec.ts', 'apps/web/**/*.test.ts', 'apps/web/**/*.test.tsx', 'canvas/**/*.test.ts', 'canvas/**/*.test.tsx', 'web/tests/**/*.test.ts', 'packages/**/*.test.ts', 'packages/**/*.test.tsx',
      'apps/server/**/*.test.ts',
      'apps/desktop/**/*.spec.ts',
      'services/**/*.test.ts', 'tests/**/*.test.ts', 'scripts/**/*.test.mjs'],
  },
})
