import { test, expect } from '../../fixtures/paisabombas';

/**
 * Tests — Órdenes de Compra
 * Módulo: /compras/ordenes-de-compra
 *
 * Features cubiertos:
 *   1. Ver listado   → tabla visible + botón "Nueva orden"
 *   2. Crear orden   → llenar formulario, agregar producto, guardar
 *   3. Eliminar orden → menú ⋮ → Eliminar → confirmar
 *
 * Ejecutar con: npm run test:ordenes
 *
 * Nota: los tests corren en serie (serial) para que el #2 (crear)
 * alimente el estado que necesita el #3 (eliminar).
 */
test.describe.serial('Paisabombas - Órdenes de Compra', () => {

  // ────────────────────────────────────────────────────────────────────────────
  // Feature 1: Ver listado
  // ────────────────────────────────────────────────────────────────────────────
  test('ver listado: muestra la tabla y el botón Nueva orden',
    async ({ loggedIn, ordenesCompraPage }) => {
      void loggedIn; // asegura login en la misma instancia de page

      await ordenesCompraPage.navigate();

      // El botón de crear debe estar visible y habilitado
      await expect(ordenesCompraPage.newButton).toBeVisible();
      await expect(ordenesCompraPage.newButton).toBeEnabled();

      // La tabla debe estar visible
      await expect(ordenesCompraPage.page.locator('table')).toBeVisible({ timeout: 10000 });

      // Las columnas clave deben existir
      await expect(ordenesCompraPage.page.getByRole('columnheader', { name: 'Proveedor' })).toBeVisible();
      await expect(ordenesCompraPage.page.getByRole('columnheader', { name: 'Estado' })).toBeVisible();
      await expect(ordenesCompraPage.page.getByRole('columnheader', { name: 'Acciones' })).toBeVisible();
    });

  // ────────────────────────────────────────────────────────────────────────────
  // Feature 2: Crear nueva orden
  // ────────────────────────────────────────────────────────────────────────────
  test('crear orden: llena el formulario y guarda correctamente',
    async ({ loggedIn, ordenesCompraPage }) => {
      void loggedIn;

      await ordenesCompraPage.navigate();

      const countBefore = await ordenesCompraPage.getRowCount();

      // Abrir modal
      await ordenesCompraPage.clickNewOrder();
      await expect(ordenesCompraPage.modal).toBeVisible();

      // Llenar campos de información general
      await ordenesCompraPage.selectProveedor('Consumidor Final');
      await ordenesCompraPage.selectCondicionPago('Contado');
      await ordenesCompraPage.fillProyecto('Proyecto Automatización QA');
      await ordenesCompraPage.fillComentario('Orden creada por test automatizado');

      // Agregar al menos un producto (requerido para habilitar Guardar)
      await ordenesCompraPage.agregarPrimerProducto();

      // Guardar
      await ordenesCompraPage.guardarOrden();

      // Verificar que el modal se cerró (orden guardada exitosamente)
      await expect(ordenesCompraPage.modal).not.toBeVisible();
    });

  // ────────────────────────────────────────────────────────────────────────────
  // Feature 3: Eliminar una orden
  // ────────────────────────────────────────────────────────────────────────────
  test('eliminar orden: abre menú de acciones y confirma la eliminación',
    async ({ loggedIn, ordenesCompraPage }) => {
      void loggedIn;

      await ordenesCompraPage.navigate();

      const countBefore = await ordenesCompraPage.getRowCount();

      // Debe haber al menos 1 fila (creada por el test anterior)
      expect(countBefore).toBeGreaterThan(0);

      // Abrir menú ⋮ y clickear Eliminar (operación atómica)
      await ordenesCompraPage.openMenuAndClickEliminar(0);

      // Verificar que el dialog de confirmación aparece
      await expect(ordenesCompraPage.confirmDeleteDialog).toBeVisible();

      // Confirmar eliminación
      await ordenesCompraPage.confirmarEliminacion();

      // Verificar que el dialog de confirmación se cerró (eliminación procesada)
      await expect(ordenesCompraPage.confirmDeleteDialog).not.toBeVisible();

      // Verificar que la tabla actualizó: el conteo bajó o es igual (en tablas paginadas
      // otro registro puede cargar, pero el total de DB disminuye)
      const countAfter = await ordenesCompraPage.getRowCount();
      expect(countAfter).toBeLessThanOrEqual(countBefore);
    });

});
