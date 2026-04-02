import { test, expect } from '../../fixtures/paisabombas';

const COMPRA_DATA = {
  proveedor: 'Proveedor de Prueba',
  fecha: '2026-01-15',
  descripcion: 'Compra de prueba creada por test automatizado',
};

const COMPRA_EDITADA = {
  proveedor: 'Proveedor Actualizado',
  fecha: '2026-02-20',
};

test.describe('Paisabombas - Compras CRUD', () => {
  test.beforeEach(async ({ loggedIn }) => {
    // loggedIn fixture handles authentication
    void loggedIn;
  });

  test('muestra el listado de compras', async ({ comprasPage }) => {
    await comprasPage.navigate();

    await expect(comprasPage.newButton).toBeVisible();
  });

  test('crea una nueva compra', async ({ comprasPage, page }) => {
    await comprasPage.navigate();
    const countBefore = await comprasPage.getRowCount();

    await comprasPage.clickNew();
    await comprasPage.fillForm(COMPRA_DATA);
    await comprasPage.saveForm();

    const countAfter = await comprasPage.getRowCount();
    expect(countAfter).toBe(countBefore + 1);
  });

  test('edita una compra existente', async ({ comprasPage, page }) => {
    await comprasPage.navigate();

    await comprasPage.clickEditRow(0);
    await comprasPage.fillForm(COMPRA_EDITADA);
    await comprasPage.saveForm();

    // Verify we are back on the list and no modal/form is open
    await expect(page.locator('table, [role="table"]')).toBeVisible();
  });

  test('elimina una compra', async ({ comprasPage }) => {
    await comprasPage.navigate();
    const countBefore = await comprasPage.getRowCount();

    await comprasPage.clickDeleteRow(0);
    await comprasPage.confirmDelete();

    const countAfter = await comprasPage.getRowCount();
    expect(countAfter).toBe(countBefore - 1);
  });
});
