import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './harness/browser',
  fullyParallel: true,
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  outputDir: 'artifacts/harness/results',
  reporter: [['list'], ['html', { outputFolder: 'artifacts/harness/report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3107',
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    locale: 'en-IE',
    timezoneId: 'Europe/Dublin'
  },
  projects: [
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'chromium-touch', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'webkit-touch', use: { browserName: 'webkit', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
  ],
  webServer: {
    command: 'node harness/serve.mjs',
    url: 'http://127.0.0.1:3107/en',
    reuseExistingServer: false,
    timeout: 30_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 }
  }
});
