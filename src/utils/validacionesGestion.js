const RX_CODIGO = /^[A-Za-z0-9\-]{1,40}$/

function t(v) {
  if (v === undefined || v === null) return ''
  return String(v).trim()
}

/**
 * Validación cliente alineada con reglas del backend (DTOs).
 * @returns {Record<string, string>}
 */
export function validarGestion(entidadKey, modal, form) {
  const e = {}

  if (modal === 'crear') {
    switch (entidadKey) {
      case 'categorias':
      case 'proveedores':
        if (!RX_CODIGO.test(t(form.codigo))) e.codigo = 'Código obligatorio: letras, números y guiones (máx. 40).'
        if (t(form.nombre).length < 1 || t(form.nombre).length > 200) e.nombre = 'Nombre entre 1 y 200 caracteres.'
        break
      case 'almacenes':
        if (!RX_CODIGO.test(t(form.codigo))) e.codigo = 'Código obligatorio: letras, números y guiones (máx. 40).'
        if (t(form.nombre).length < 1 || t(form.nombre).length > 200) e.nombre = 'Nombre entre 1 y 200 caracteres.'
        if (t(form.ubicacion).length < 1 || t(form.ubicacion).length > 500) e.ubicacion = 'Ubicación entre 1 y 500 caracteres.'
        break
      case 'insumos':
        if (!RX_CODIGO.test(t(form.codigo))) e.codigo = 'Código obligatorio: letras, números y guiones (máx. 40).'
        if (t(form.nombre).length < 1 || t(form.nombre).length > 200) e.nombre = 'Nombre entre 1 y 200 caracteres.'
        if (t(form.descripcion).length < 1 || t(form.descripcion).length > 2000) e.descripcion = 'Descripción entre 1 y 2000 caracteres.'
        if (!t(form.codigoCategoria)) e.codigoCategoria = 'Seleccioná una categoría.'
        break
      case 'camas':
        if (!RX_CODIGO.test(t(form.codigo))) e.codigo = 'Código obligatorio: letras, números y guiones (máx. 40).'
        {
          const n = Number(form.cantidad)
          if (!Number.isFinite(n) || n < 1) e.cantidad = 'La cantidad debe ser un entero mayor a cero.'
        }
        break
      case 'usuarios':
        if (!RX_CODIGO.test(t(form.codigo))) e.codigo = 'Código obligatorio: letras, números y guiones (máx. 40).'
        if (t(form.nombre).length < 1 || t(form.nombre).length > 200) e.nombre = 'Nombre entre 1 y 200 caracteres.'
        if (t(form.rol).length < 1 || t(form.rol).length > 100) e.rol = 'Rol entre 1 y 100 caracteres.'
        break
      case 'distribuciones':
      case 'suministros':
      case 'logisticas':
        if (!RX_CODIGO.test(t(form.codigo))) e.codigo = 'Código obligatorio: letras, números y guiones (máx. 40).'
        if (entidadKey === 'distribuciones') {
          if (!t(form.codigoInsumo)) e.codigoInsumo = 'Seleccioná un insumo.'
          if (!t(form.codigoAlmacen)) e.codigoAlmacen = 'Seleccioná un almacén.'
        }
        if (entidadKey === 'suministros') {
          if (!t(form.codigoInsumo)) e.codigoInsumo = 'Seleccioná un insumo.'
          if (!t(form.codigoProveedor)) e.codigoProveedor = 'Seleccioná un proveedor.'
        }
        if (entidadKey === 'logisticas') {
          if (!t(form.codigoProveedor)) e.codigoProveedor = 'Seleccioná un proveedor.'
          if (!t(form.codigoAlmacen)) e.codigoAlmacen = 'Seleccioná un almacén.'
        }
        break
      default:
        break
    }
  } else if (modal === 'editar') {
    switch (entidadKey) {
      case 'categorias':
      case 'proveedores':
        if (t(form.nuevoNombre).length < 1 || t(form.nuevoNombre).length > 200) e.nuevoNombre = 'Nombre entre 1 y 200 caracteres.'
        break
      case 'almacenes':
        if (t(form.nuevoNombre).length < 1 || t(form.nuevoNombre).length > 200) e.nuevoNombre = 'Nombre entre 1 y 200 caracteres.'
        if (t(form.nuevaUbicacion).length < 1 || t(form.nuevaUbicacion).length > 500) e.nuevaUbicacion = 'Ubicación entre 1 y 500 caracteres.'
        break
      case 'insumos':
        if (t(form.nuevoNombre).length < 1 || t(form.nuevoNombre).length > 200) e.nuevoNombre = 'Nombre entre 1 y 200 caracteres.'
        if (t(form.nuevaDescripcion).length < 1 || t(form.nuevaDescripcion).length > 2000) e.nuevaDescripcion = 'Descripción entre 1 y 2000 caracteres.'
        if (!t(form.codigoCategoria)) e.codigoCategoria = 'Seleccioná una categoría.'
        break
      case 'camas':
        {
          const n = Number(form.nuevaCantidad)
          if (!Number.isFinite(n) || n < 1) e.nuevaCantidad = 'La cantidad debe ser un entero mayor a cero.'
        }
        break
      case 'usuarios':
        if (t(form.nuevoNombre).length < 1 || t(form.nuevoNombre).length > 200) e.nuevoNombre = 'Nombre entre 1 y 200 caracteres.'
        if (t(form.nuevoRol).length < 1 || t(form.nuevoRol).length > 100) e.nuevoRol = 'Rol entre 1 y 100 caracteres.'
        break
      default:
        break
    }
  }

  return e
}
