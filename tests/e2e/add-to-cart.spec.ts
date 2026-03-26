import { test, expect } from '../fixtures';

const USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';
const PRODUCT_ID = 'sauce-labs-bolt-t-shirt';

test.describe('SauceDemo - Añadir camiseta al carrito', () => {
  test('el usuario puede iniciar sesión y añadir una camiseta al carrito', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.navigate();
    await loginPage.login(USERNAME, PASSWORD);

    await expect(page).toHaveURL(/inventory/);

    await inventoryPage.addToCart(PRODUCT_ID);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
