import { test as base } from '@playwright/test';
import { AuthPage } from '../../pages/paisabombas/AuthPage';
import { OrdenesCompraPage } from '../../pages/paisabombas/OrdenesCompraPage';

type PaisabombasFixtures = {
  authPage: AuthPage;
  ordenesCompraPage: OrdenesCompraPage;
  loggedIn: void;
};

const EMAIL    = process.env.APP_EMAIL    ?? 'apollostudiogt@gmail.com';
const PASSWORD = process.env.APP_PASSWORD ?? 'wQt2x7@zI10*';

export const test = base.extend<PaisabombasFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  ordenesCompraPage: async ({ page }, use) => {
    await use(new OrdenesCompraPage(page));
  },

  // Fixture compartido: realiza login y espera a que el dashboard esté cargado
  loggedIn: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await authPage.navigate();
    await authPage.login(EMAIL, PASSWORD);
    // Confirmar que estamos en el dashboard antes de ceder control al test
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    await use();
  },
});

export { expect } from '@playwright/test';
