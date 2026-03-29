import { test, expect } from '../../fixtures/paisabombas';

const EMAIL = process.env.APP_EMAIL ?? 'apollostudiogt@gmail.com';
const PASSWORD = process.env.APP_PASSWORD ?? '';

test.describe('Paisabombas - Autenticación', () => {
  test('login con credenciales válidas redirige al dashboard', async ({ authPage, page }) => {
    await authPage.navigate();

    await expect(authPage.isLoginPage()).resolves.toBe(true);

    await authPage.login(EMAIL, PASSWORD);

    // Verify redirect away from login page after successful login
    await expect(page).not.toHaveURL(/login|signin|auth/i);
  });

  test('login con contraseña incorrecta muestra mensaje de error', async ({ authPage }) => {
    await authPage.navigate();
    await authPage.login(EMAIL, 'contraseña-incorrecta');

    await expect(authPage.errorMessage).toBeVisible();
  });
});
