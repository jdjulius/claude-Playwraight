import { Page } from '@playwright/test';
import { BaseCrudPage } from './BaseCrudPage';

export interface OrdenCompraData {
  numero: string;
  proveedor: string;
  fecha: string;
}

export class OrdenesCompraPage extends BaseCrudPage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/ordenes-compra');
    await this.page.waitForLoadState('networkidle');
  }

  async fillForm(data: OrdenCompraData): Promise<void> {
    await this.fillByLabel(/n[uú]mero|n[°º]|order/i, data.numero);
    await this.fillByLabel(/proveedor/i, data.proveedor);
    await this.fillByLabel(/fecha/i, data.fecha);
  }
}
