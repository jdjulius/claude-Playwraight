import { test, expect } from '../../fixtures/paisabombas';

/**
 * Tests de autenticación — Paisabombas
 * Ejecutar con: npm run test:login
 */

const EMAIL    = process.env.APP_EMAIL    ?? 'apollostudiogt@gmail.com';
const PASSWORD = process.env.APP_PASSWORD ?? 'wQt2x7@zI10*';

test.describe('Paisabombas - Login', () => {

  test('login con credenciales válidas redirige al dashboard', async ({ authPage, page }) => {
    // 1. Navegar al sitio
    await authPage.navigate();

    // 2. Verificar que estamos en la página de login
    await expect(authPage.isLoginPage()).resolves.toBe(true);

    // 3. Realizar el login
    await authPage.login(EMAIL, PASSWORD);

    // 4. Verificar que se redirigió fuera del login
    await expect(page).not.toHaveURL(/login|signin|auth/i);
  });

  test('login con contraseña incorrecta muestra mensaje de error', async ({ authPage }) => {
    // 1. Navegar al sitio
    await authPage.navigate();

    // 2. Intentar login con contraseña incorrecta
    await authPage.login(EMAIL, 'contraseña-incorrecta');

    // 3. Verificar que aparece un mensaje de error
    await expect(authPage.errorMessage).toBeVisible();
  });

});
