import { test, expect } from '../fixtures';

const USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

const PRODUCTS = [
  { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack' },
  { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light' },
  { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt' },
];

test.describe('SauceDemo - Carrito de compras', () => {
  test('el usuario puede añadir 3 productos al carrito y verificarlos', async ({
    loginPage,
    inventoryPage,
    cartPage,
    page,
  }) => {
    await loginPage.navigate();
    await loginPage.login(USERNAME, PASSWORD);

    await expect(page).toHaveURL(/inventory/);

    for (const product of PRODUCTS) {
      await inventoryPage.addToCart(product.id);
    }

    await expect(inventoryPage.cartBadge).toHaveText('3');

    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/cart/);

    expect(await cartPage.getItemCount()).toBe(3);

    const itemNames = await cartPage.getItemNames();
    for (const product of PRODUCTS) {
      expect(itemNames).toContain(product.name);
    }
  });
});
