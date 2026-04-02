import { test } from '../../fixtures/paisabombas';

/**
 * TODO: Automatizar Compras con selectores reales.
 * Estos tests requieren exploración del módulo /compras/aprobadas
 * y actualización de ComprasPage.ts — igual que se hizo con OrdenesCompraPage.
 *
 * Rutas reales descubiertas:
 *   - Listado : /compras/aprobadas
 *
 * Estado: pendiente de automatización.
 */
test.describe('Paisabombas - Compras', () => {

  test.skip('muestra el listado de compras', async () => {
    // TODO: implementar con selectores reales de /compras/aprobadas
  });

  test.skip('crea una nueva compra', async () => {
    // TODO: explorar formulario y agregar productos igual que en Órdenes
  });

  test.skip('edita una compra existente', async () => {
    // TODO: implementar flujo de edición
  });

  test.skip('elimina una compra', async () => {
    // TODO: implementar con menú ⋮ → Eliminar → confirmar
  });

});
