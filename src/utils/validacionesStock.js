/**
 * Validación de formulario de movimiento de stock (alineada con Movimiento + Detalle en backend).
 * @param {object} form
 * @param {boolean} esEntrada
 * @returns {Record<string, string>}
 */
export function validarStockMovimiento(form, esEntrada) {
  const e = {}
  if (!String(form.codigoUsuario || '').trim()) e.codigoUsuario = 'Seleccioná un usuario.'
  if (!String(form.codigoInsumo || '').trim()) e.codigoInsumo = 'Seleccioná un insumo.'
  if (!String(form.codigoAlmacen || '').trim()) e.codigoAlmacen = 'Seleccioná un almacén.'
  if (!String(form.codigoProveedor || '').trim()) e.codigoProveedor = 'Seleccioná un proveedor.'

  const nRaw = String(form.cantidad ?? '').trim()
  const n = Number(nRaw)
  if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) {
    e.cantidad = 'La cantidad debe ser un entero mayor a cero.'
  }

  if (esEntrada) {
    const l = String(form.lote || '').trim()
    if (!l) e.lote = 'El lote es obligatorio en entradas.'
    else if (l.length > 120) e.lote = 'El lote no puede superar 120 caracteres.'
    if (!String(form.fechaVencimiento || '').trim())
      e.fechaVencimiento = 'La fecha de vencimiento es obligatoria en entradas.'
  }

  return e
}
