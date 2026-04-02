/**
 * Exploration test — NOT a functional test.
 * Run this to discover the real URL routes and selectors of dev.paisabombas.app.
 * Results are saved to test-results/explore/ as HTML dumps and screenshots.
 *
 * Usage:
 *   npx playwright test tests/e2e/paisabombas/explore.spec.ts --project=paisabombas --headed
 */

import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const EMAIL = process.env.APP_EMAIL ?? 'apollostudiogt@gmail.com';
const PASSWORD = process.env.APP_PASSWORD ?? 'wQt2x7@zI10*';
const OUT_DIR = path.join('test-results', 'explore');

function saveHtml(name: string, html: string): void {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${name}.html`), html, 'utf-8');
}

function logInteractives(label: string, html: string): void {
  // Extract inputs
  const inputs = [...html.matchAll(/<input[^>]*>/gi)].map(m => m[0]).slice(0, 30);
  // Extract buttons
  const buttons = [...html.matchAll(/<button[^>]*>[\s\S]*?<\/button>/gi)].map(m => m[0].replace(/\s+/g, ' ').substring(0, 200)).slice(0, 30);
  // Extract labels
  const labels = [...html.matchAll(/<label[^>]*>[\s\S]*?<\/label>/gi)].map(m => m[0].replace(/\s+/g, ' ').substring(0, 200)).slice(0, 30);
  // Extract links (navigation)
  const links = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]).filter(h => !h.startsWith('http') || h.includes('paisabombas')).slice(0, 30);

  console.log(`\n===== ${label} =====`);
  console.log('INPUTS:', JSON.stringify(inputs, null, 2));
  console.log('BUTTONS:', JSON.stringify(buttons, null, 2));
  console.log('LABELS:', JSON.stringify(labels, null, 2));
  console.log('NAV LINKS:', JSON.stringify(links, null, 2));
}

test('explore: login page structure', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const html = await page.content();
  saveHtml('01-login-page', html);
  logInteractives('LOGIN PAGE', html);
  await page.screenshot({ path: path.join(OUT_DIR, '01-login-page.png'), fullPage: true });

  console.log('\nLOGIN PAGE URL:', page.url());
});

test('explore: post-login dashboard and navigation', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(OUT_DIR, '02-before-login.png') });

  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle');

  const dashUrl = page.url();
  const dashHtml = await page.content();
  saveHtml('03-dashboard', dashHtml);
  await page.screenshot({ path: path.join(OUT_DIR, '03-dashboard.png'), fullPage: true });

  console.log('\nDASHBOARD URL:', dashUrl);
  logInteractives('DASHBOARD', dashHtml);

  // Find all nav links / sidebar items
  const navTexts = await page.locator('nav a, aside a, [role="navigation"] a, .sidebar a, .menu a').allTextContents();
  console.log('NAV TEXTS:', navTexts);

  const navHrefs = await page.locator('nav a, aside a, [role="navigation"] a, .sidebar a, .menu a').evaluateAll(
    els => els.map(e => ({ text: (e as HTMLElement).innerText?.trim(), href: (e as HTMLAnchorElement).href }))
  );
  console.log('NAV HREFS:', JSON.stringify(navHrefs, null, 2));
});

test('explore: try compras routes', async ({ page }) => {
  // Login first
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle');

  const candidateRoutes = [
    '/compras', '/purchases', '/compra',
    '/ordenes-compra', '/purchase-orders', '/ordenes', '/orders',
    '/procesar-compras', '/process-purchases', '/procesar',
  ];

  for (const route of candidateRoutes) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const finalUrl = page.url();
    const status = finalUrl.includes('login') || finalUrl.includes('auth') ? 'REDIRECTED_TO_LOGIN' : 'OK';
    const html = await page.content();
    const safeName = route.replace(/\//g, '_');
    saveHtml(`route${safeName}`, html);
    await page.screenshot({ path: path.join(OUT_DIR, `route${safeName}.png`) });
    logInteractives(`ROUTE ${route} (${status}) → ${finalUrl}`, html);
  }
});

test('explore: compras form fields', async ({ page }) => {
  // Login first
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle');

  // Try to find and click "New" button in compras
  const routesToTry = ['/compras', '/purchases', '/compra'];

  for (const route of routesToTry) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    if (page.url().includes('login')) continue;

    console.log(`\nFound compras at: ${page.url()}`);

    // Try clicking new button
    const newBtnCandidates = [
      page.getByRole('button', { name: /nuevo|crear|agregar|new|add/i }),
      page.locator('[data-testid*="new"], [data-testid*="create"], [data-testid*="add"]'),
      page.locator('button.btn-primary, button.primary, button[class*="primary"]'),
    ];

    for (const btn of newBtnCandidates) {
      const count = await btn.count();
      if (count > 0) {
        console.log(`Found new button with count: ${count}`);
        await btn.first().click();
        await page.waitForTimeout(1000);
        const formHtml = await page.content();
        saveHtml('compras-form', formHtml);
        await page.screenshot({ path: path.join(OUT_DIR, 'compras-form.png'), fullPage: true });
        logInteractives('COMPRAS FORM', formHtml);
        break;
      }
    }
    break;
  }
});
