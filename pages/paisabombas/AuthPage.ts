import { Page, Locator } from '@playwright/test';

export class AuthPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[role="alert"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    // Esperar a que la URL cambie fuera del login (confirma que la sesión quedó activa)
    await this.page.waitForURL(url => !url.pathname.includes('login'), { timeout: 15000 });
  }

  async isLoginPage(): Promise<boolean> {
    return this.emailInput.isVisible();
  }
}
