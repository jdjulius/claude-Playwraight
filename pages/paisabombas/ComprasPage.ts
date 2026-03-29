import { Page } from '@playwright/test';
import { BaseCrudPage } from './BaseCrudPage';

export interface CompraData {
  proveedor: string;
  fecha: string;
  descripcion?: string;
}

export class ComprasPage extends BaseCrudPage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/compras');
    await this.page.waitForLoadState('networkidle');
  }

  async fillForm(data: CompraData): Promise<void> {
    await this.fillByLabel(/proveedor/i, data.proveedor);
    await this.fillByLabel(/fecha/i, data.fecha);
    if (data.descripcion) {
      await this.fillByLabel(/descripci[oó]n|notas|detalle/i, data.descripcion);
    }
  }
}
