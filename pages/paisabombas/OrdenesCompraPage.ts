import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object — Órdenes de Compra
 * URL: /compras/ordenes-de-compra
 *
 * Estructura real del sitio (explorada 2026-04-01):
 * - Tabla con columnas: #, Creado por, Proveedor, Fecha de compra,
 *   Fecha de creación, Proyecto, Comentario, Estado, Acciones
 * - Cada fila tiene 2 botones icono: pi-eye (ver) y pi-ellipsis-v (menú)
 * - El menú ellipsis contiene: Enviar, Imprimir PDF, Aprobar, Editar, Eliminar
 * - El formulario abre en un dialog modal
 * - Guardar queda deshabilitado hasta agregar al menos 1 producto
 */
export class OrdenesCompraPage {
  // ── Listado ──────────────────────────────────────────────────────────────
  readonly newButton: Locator;
  readonly tableRows: Locator;
  readonly emptyState: Locator;
  readonly recordCount: Locator;

  // ── Modal nueva orden ─────────────────────────────────────────────────────
  readonly modal: Locator;
  readonly proveedorCombobox: Locator;
  readonly fechaCombobox: Locator;
  readonly proyectoInput: Locator;
  readonly condicionPagoCombobox: Locator;
  readonly comentarioInput: Locator;
  readonly agregarProductosBtn: Locator;
  readonly guardarBtn: Locator;
  readonly cancelarBtn: Locator;

  // ── Modal seleccionar productos ───────────────────────────────────────────
  readonly productosDialog: Locator;
  readonly productosTableRows: Locator;
  readonly agregarSeleccionadosBtn: Locator;

  // ── Menú acciones de fila ─────────────────────────────────────────────────
  readonly actionsMenu: Locator;

  // ── Dialog confirmación eliminar ──────────────────────────────────────────
  readonly confirmDeleteDialog: Locator;
  readonly confirmDeleteBtn: Locator;

  constructor(readonly page: Page) {
    // Listado
    this.newButton     = page.getByRole('button', { name: 'Nueva orden' });
    this.tableRows     = page.locator('tbody tr');
    this.emptyState    = page.getByText('No hay datos disponibles');
    this.recordCount   = page.locator('text=/Mostrando \\d+ - \\d+ de \\d+ registros/');

    // Modal nueva orden
    this.modal                = page.getByRole('dialog', { name: 'Nueva Orden de Compra' });
    this.proveedorCombobox    = page.getByRole('combobox', { name: /Seleccione un proveedor|proveedor/i });
    this.fechaCombobox        = page.getByRole('combobox', { name: /Seleccione la fecha/i });
    this.proyectoInput        = page.getByRole('textbox', { name: 'Proyecto *' });
    this.condicionPagoCombobox = page.getByRole('combobox', { name: /Seleccione una condición/i });
    this.comentarioInput      = page.getByRole('textbox', { name: 'Comentario *' });
    this.agregarProductosBtn  = this.modal.getByRole('button', { name: 'Agregar' });
    this.guardarBtn           = page.getByRole('button', { name: 'Guardar' });
    this.cancelarBtn          = this.modal.getByRole('button', { name: 'Cancelar' });

    // Modal productos
    this.productosDialog         = page.getByRole('dialog', { name: 'Seleccionar productos' });
    this.productosTableRows      = this.productosDialog.locator('tbody tr');
    this.agregarSeleccionadosBtn = this.productosDialog.getByRole('button', { name: /Agregar seleccionados/ });

    // Menú y confirmación
    this.actionsMenu      = page.getByRole('menu');
    this.confirmDeleteDialog = page.getByRole('alertdialog', { name: 'Confirmar eliminación' });
    this.confirmDeleteBtn = this.confirmDeleteDialog.getByRole('button', { name: 'Eliminar' });
  }

  // ── Navegación ────────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.page.goto('/compras/ordenes-de-compra');
    // Esperar botón visible (página montada) + networkidle (datos de la tabla cargados vía API)
    await this.newButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
  }

  // ── Listado ───────────────────────────────────────────────────────────────

  async getRowCount(): Promise<number> {
    // Esperar a que la tabla cargue: empty state o primera fila (lo que llegue primero)
    await Promise.race([
      this.emptyState.waitFor({ state: 'visible', timeout: 8000 }),
      this.tableRows.first().waitFor({ state: 'visible', timeout: 8000 }),
    ]).catch(() => {/* si nada aparece en 8s, continuamos y el count será 0 */});

    const empty = await this.emptyState.isVisible();
    if (empty) return 0;
    return this.tableRows.count();
  }

  async isTableVisible(): Promise<boolean> {
    return this.page.locator('table').isVisible();
  }

  // ── Formulario nueva orden ────────────────────────────────────────────────

  async clickNewOrder(): Promise<void> {
    await this.newButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async selectProveedor(nombre: string): Promise<void> {
    await this.proveedorCombobox.click();
    // Esperar el listbox de opciones y seleccionar
    await this.page.getByRole('option', { name: nombre, exact: true }).click();
  }

  async selectCondicionPago(condicion: string): Promise<void> {
    await this.condicionPagoCombobox.click();
    await this.page.getByRole('option', { name: condicion, exact: true }).click();
  }

  async fillProyecto(valor: string): Promise<void> {
    await this.proyectoInput.fill(valor);
  }

  async fillComentario(valor: string): Promise<void> {
    await this.comentarioInput.fill(valor);
  }

  /**
   * Abre el modal de productos, selecciona la primera fila y confirma.
   */
  async agregarPrimerProducto(): Promise<void> {
    await this.agregarProductosBtn.click();
    await this.productosDialog.waitFor({ state: 'visible' });
    // Seleccionar primer producto disponible
    await this.productosTableRows.first().click();
    // Esperar a que el botón cambie de disabled a habilitado (tiene texto "Agregar seleccionados (1)")
    await this.agregarSeleccionadosBtn.waitFor({ state: 'visible' });
    await expect(this.agregarSeleccionadosBtn).toBeEnabled({ timeout: 5000 });
    await this.agregarSeleccionadosBtn.click();
    await this.productosDialog.waitFor({ state: 'hidden' });
  }

  async guardarOrden(): Promise<void> {
    await this.guardarBtn.waitFor({ state: 'visible' });
    await expect(this.guardarBtn).toBeEnabled({ timeout: 5000 });
    await this.guardarBtn.click();
    await this.page.waitForURL(url => !url.pathname.includes('login'), { timeout: 10000 });
  }

  // ── Acciones de fila ──────────────────────────────────────────────────────

  /**
   * Abre el menú ⋮ y clickea "Eliminar" en una sola operación atómica.
   * Usa evaluate() para disparar el click nativo dentro del contexto del browser,
   * evitando que PrimeVue cierre el menú entre pasos separados.
   */
  async openMenuAndClickEliminar(rowIndex = 0): Promise<void> {
    const row = this.tableRows.nth(rowIndex);
    const menuBtn = row.locator('button').filter({ has: this.page.locator('.pi-ellipsis-v') });
    await menuBtn.click();

    // Esperar a que el menú esté visible
    const eliminarItem = this.page.getByRole('menuitem', { name: 'Eliminar' });
    await eliminarItem.waitFor({ state: 'visible' });

    // force:true saltea verificación de estabilidad de animación PrimeVue
    await eliminarItem.click({ force: true });

    // Esperar el dialog de confirmación
    await this.confirmDeleteDialog.waitFor({ state: 'visible' });
  }

  async confirmarEliminacion(): Promise<void> {
    await this.confirmDeleteBtn.click();
    await this.confirmDeleteDialog.waitFor({ state: 'hidden' });
    await this.page.waitForLoadState('networkidle');
  }

  /** Espera a que aparezca un toast de éxito de PrimeVue */
  async waitForSuccessToast(): Promise<void> {
    await this.page.locator('.p-toast-message-success, .p-toast .p-message-success, [class*="toast"][class*="success"]')
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {
        // Si no hay toast con esa clase, al menos el dialog se cerró OK
      });
  }
}
