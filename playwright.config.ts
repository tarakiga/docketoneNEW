import { defineConfig, devices } from '@playwright/test'

/**
 * Runs against the static export in out/, not the dev server.
 *
 * That is deliberate: the dev server has served stale CSS in the past, and the
 * export is what actually ships. Run `npm run build` first.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list']],
  // A fixed viewport matters here. Contrast results are viewport-dependent —
  // widgets render different elements at different breakpoints — so a floating
  // viewport makes runs incomparable.
  use: {
    baseURL: 'http://127.0.0.1:4321',
    viewport: { width: 1280, height: 900 },
    // system Chrome, so CI/dev needs no browser download
    channel: 'chrome',
  },
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: {
    command: 'npx --yes serve out -l 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
