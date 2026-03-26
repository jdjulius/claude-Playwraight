import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async addToCart(productDataTestId: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${productDataTestId}"]`).click();
  }

  async getCartCount(): Promise<string> {
    return (await this.cartBadge.textContent()) ?? '0';
  }
}
