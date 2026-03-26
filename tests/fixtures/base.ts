import { test as base } from '@playwright/test';

// Extend base test with custom fixtures here
export const test = base.extend({
  // Example custom fixture:
  // authenticatedPage: async ({ page }, use) => {
  //   await page.goto('/login');
  //   await page.fill('[name=username]', process.env.TEST_USER!);
  //   await page.fill('[name=password]', process.env.TEST_PASSWORD!);
  //   await page.click('[type=submit]');
  //   await use(page);
  // },
});

export { expect } from '@playwright/test';
