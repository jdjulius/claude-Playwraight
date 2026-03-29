import { test, expect } from '../../fixtures/paisabombas';

const PROCESO_DATA = {
  compraId: '1',
  fechaProceso: '2026-01-20',
  observaciones: 'Proceso de prueba creado por test automatizado',
};

const PROCESO_EDITADO = {
  compraId: '1',
  fechaProceso: '2026-02-25',
  observaciones: 'Observación actualizada por test',
};

test.describe('Paisabombas - Procesar Compras CRUD', () => {
  test.beforeEach(async ({ loggedIn }) => {
    void loggedIn;
  });

  test('muestra el listado de procesar compras', async ({ procesarComprasPage }) => {
    await procesarComprasPage.navigate();

    await expect(procesarComprasPage.newButton).toBeVisible();
  });

  test('crea un nuevo proceso de compra', async ({ procesarComprasPage }) => {
    await procesarComprasPage.navigate();
    const countBefore = await procesarComprasPage.getRowCount();

    await procesarComprasPage.clickNew();
    await procesarComprasPage.fillForm(PROCESO_DATA);
    await procesarComprasPage.saveForm();

    const countAfter = await procesarComprasPage.getRowCount();
    expect(countAfter).toBe(countBefore + 1);
  });

  test('edita un proceso de compra existente', async ({ procesarComprasPage, page }) => {
    await procesarComprasPage.navigate();

    await procesarComprasPage.clickEditRow(0);
    await procesarComprasPage.fillForm(PROCESO_EDITADO);
    await procesarComprasPage.saveForm();

    await expect(page.locator('table, [role="table"]')).toBeVisible();
  });

  test('elimina un proceso de compra', async ({ procesarComprasPage }) => {
    await procesarComprasPage.navigate();
    const countBefore = await procesarComprasPage.getRowCount();

    await procesarComprasPage.clickDeleteRow(0);
    await procesarComprasPage.confirmDelete();

    const countAfter = await procesarComprasPage.getRowCount();
    expect(countAfter).toBe(countBefore - 1);
  });
});
