import { chromium } from '@playwright/test';
import * as fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results: Record<string, string> = {};

  // 1. Login page
  await page.goto('https://dev.paisabombas.app');
  await page.waitForLoadState('networkidle');
  results['login_url'] = page.url();
  results['login_html'] = await page.content();

  // 2. Login
  try {
    await page.locator('input[type="email"]').fill('apollostudiogt@gmail.com');
    await page.locator('input[type="password"]').fill('wQt2x7@zI10*');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');
    results['after_login_url'] = page.url();
    results['after_login_html'] = await page.content();
  } catch (e: any) {
    results['login_error'] = e.message;
  }

  // 3. Try navigating to compras-related routes
  const routes = ['/compras', '/ordenes-compra', '/procesar-compras', '/purchases', '/orders', '/purchase-orders', '/process'];
  for (const route of routes) {
    try {
      await page.goto('https://dev.paisabombas.app' + route);
      await page.waitForLoadState('networkidle');
      results[`route_${route}_url`] = page.url();
      results[`route_${route}_html`] = await page.content();
    } catch (e: any) {
      results[`route_${route}_error`] = e.message;
    }
  }

  await browser.close();
  fs.writeFileSync('/tmp/site-exploration.json', JSON.stringify(results, null, 2));
  console.log('Done! Results saved to /tmp/site-exploration.json');
  console.log('Keys:', Object.keys(results));
  console.log('after_login_url:', results['after_login_url']);
})();
