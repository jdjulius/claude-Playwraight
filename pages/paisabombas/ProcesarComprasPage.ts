import { Page } from '@playwright/test';
import { BaseCrudPage } from './BaseCrudPage';

export interface ProcesarCompraData {
  compraId: string;
  fechaProceso: string;
  observaciones?: string;
}

export class ProcesarComprasPage extends BaseCrudPage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/procesar-compras');
    await this.page.waitForLoadState('networkidle');
  }

  async fillForm(data: ProcesarCompraData): Promise<void> {
    await this.fillByLabel(/compra|orden|pedido/i, data.compraId);
    await this.fillByLabel(/fecha/i, data.fechaProceso);
    if (data.observaciones) {
      await this.fillByLabel(/observaci[oó]n|notas|comentario/i, data.observaciones);
    }
  }
}
