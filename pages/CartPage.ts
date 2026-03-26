import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('[data-test="inventory-item-name"]');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItems.allTextContents();
  }
}
