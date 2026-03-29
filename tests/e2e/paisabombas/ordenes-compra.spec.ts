import { test, expect } from '../../fixtures/paisabombas';

const ORDEN_DATA = {
  numero: 'OC-TEST-001',
  proveedor: 'Proveedor de Prueba',
  fecha: '2026-01-15',
};

const ORDEN_EDITADA = {
  numero: 'OC-TEST-001-MOD',
  proveedor: 'Proveedor Actualizado',
  fecha: '2026-02-20',
};

test.describe('Paisabombas - Órdenes de Compra CRUD', () => {
  test.beforeEach(async ({ loggedIn }) => {
    void loggedIn;
  });

  test('muestra el listado de órdenes de compra', async ({ ordenesCompraPage }) => {
    await ordenesCompraPage.navigate();

    await expect(ordenesCompraPage.newButton).toBeVisible();
  });

  test('crea una nueva orden de compra', async ({ ordenesCompraPage }) => {
    await ordenesCompraPage.navigate();
    const countBefore = await ordenesCompraPage.getRowCount();

    await ordenesCompraPage.clickNew();
    await ordenesCompraPage.fillForm(ORDEN_DATA);
    await ordenesCompraPage.saveForm();

    const countAfter = await ordenesCompraPage.getRowCount();
    expect(countAfter).toBe(countBefore + 1);
  });

  test('edita una orden de compra existente', async ({ ordenesCompraPage, page }) => {
    await ordenesCompraPage.navigate();

    await ordenesCompraPage.clickEditRow(0);
    await ordenesCompraPage.fillForm(ORDEN_EDITADA);
    await ordenesCompraPage.saveForm();

    await expect(page.locator('table, [role="table"]')).toBeVisible();
  });

  test('elimina una orden de compra', async ({ ordenesCompraPage }) => {
    await ordenesCompraPage.navigate();
    const countBefore = await ordenesCompraPage.getRowCount();

    await ordenesCompraPage.clickDeleteRow(0);
    await ordenesCompraPage.confirmDelete();

    const countAfter = await ordenesCompraPage.getRowCount();
    expect(countAfter).toBe(countBefore - 1);
  });
});
