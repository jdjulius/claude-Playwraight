import { Page, Locator } from '@playwright/test';

export abstract class BaseCrudPage {
  readonly tableRows: Locator;
  readonly newButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(protected readonly page: Page) {
    // Resilient locators for common CRUD UI patterns in Spanish admin apps
    this.newButton = page
      .getByRole('button', { name: /nuevo|crear|agregar/i })
      .or(page.locator('button[title*="Nuevo" i], button[title*="Crear" i], button[title*="Agregar" i]'))
      .first();
    this.tableRows = page.locator('tbody tr');
    this.saveButton = page.getByRole('button', { name: /guardar|save/i });
    this.cancelButton = page.getByRole('button', { name: /cancelar|cancel/i });
  }

  abstract navigate(): Promise<void>;

  async clickNew(): Promise<void> {
    await this.newButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async clickEditRow(rowIndex = 0): Promise<void> {
    await this.tableRows
      .nth(rowIndex)
      .getByRole('button', { name: /editar|edit/i })
      .click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickDeleteRow(rowIndex = 0): Promise<void> {
    await this.tableRows
      .nth(rowIndex)
      .getByRole('button', { name: /eliminar|delete/i })
      .click();
  }

  async saveForm(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async cancelForm(): Promise<void> {
    await this.cancelButton.click();
  }

  async confirmDelete(): Promise<void> {
    await this.page
      .getByRole('button', { name: /confirmar|sí|yes|aceptar/i })
      .last()
      .click();
    await this.page.waitForLoadState('networkidle');
  }

  protected async fillByLabel(labelPattern: RegExp, value: string): Promise<void> {
    await this.page
      .getByLabel(labelPattern)
      .or(this.page.getByPlaceholder(labelPattern))
      .first()
      .fill(value);
  }

  protected async selectByLabel(labelPattern: RegExp, value: string): Promise<void> {
    await this.page
      .getByLabel(labelPattern)
      .selectOption({ label: value });
  }
}
