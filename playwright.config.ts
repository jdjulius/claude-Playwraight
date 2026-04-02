import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',
  },
  projects: [
    {
      name: 'saucedemo',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        baseURL: process.env.SAUCE_BASE_URL ?? 'https://www.saucedemo.com',
      },
      testMatch: ['**/add-to-cart.spec.ts'],
    },
    {
      name: 'paisabombas',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        baseURL: process.env.APP_BASE_URL ?? 'https://dev.paisabombas.app',
      },
      testMatch: ['**/paisabombas/**/*.spec.ts'],
    },
  ],
  outputDir: 'test-results/',
});
