import { test as base } from '@playwright/test';
import { AuthPage } from '../../pages/paisabombas/AuthPage';
import { ComprasPage } from '../../pages/paisabombas/ComprasPage';
import { OrdenesCompraPage } from '../../pages/paisabombas/OrdenesCompraPage';
import { ProcesarComprasPage } from '../../pages/paisabombas/ProcesarComprasPage';

type PaisabombasFixtures = {
  authPage: AuthPage;
  comprasPage: ComprasPage;
  ordenesCompraPage: OrdenesCompraPage;
  procesarComprasPage: ProcesarComprasPage;
  loggedIn: void;
};

const EMAIL = process.env.APP_EMAIL ?? 'apollostudiogt@gmail.com';
const PASSWORD = process.env.APP_PASSWORD ?? '';

export const test = base.extend<PaisabombasFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  comprasPage: async ({ page }, use) => {
    await use(new ComprasPage(page));
  },
  ordenesCompraPage: async ({ page }, use) => {
    await use(new OrdenesCompraPage(page));
  },
  procesarComprasPage: async ({ page }, use) => {
    await use(new ProcesarComprasPage(page));
  },
  // Shared fixture: performs login once before tests that need it
  loggedIn: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await authPage.navigate();
    await authPage.login(EMAIL, PASSWORD);
    await use();
  },
});

export { expect } from '@playwright/test';
