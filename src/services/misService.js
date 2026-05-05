import api from './api'

// Genéricas
export const getListadoInsumosConCategoria = () => api.get('/MisGenericas/listado-insumos-con-categoria')
export const getInsumosPorCategoriaConteo  = () => api.get('/MisGenericas/insumos-por-categoria-conteo')
export const getCantidadTotalPorAlmacen    = () => api.get('/MisGenericas/cantidad-total-por-almacen')
export const getInsumosSinProveedor        = () => api.get('/MisGenericas/insumos-sin-proveedor')

// Inventario
export const getInventarioPorAlmacen   = () => api.get('/MisInventario/inventario-por-almacen')
export const getProximosAVencer        = () => api.get('/MisInventario/proximos-a-vencer')
export const getAlmacenesSinInsumos    = () => api.get('/MisInventario/almacenes-sin-insumos')
export const getInsumosMasSolicitados  = () => api.get('/MisInventario/insumos-mas-solicitados')
export const getInsumosSinDistribucion = () => api.get('/MisInventario/insumos-sin-distribucion')
export const getStockActual = () => api.get('/MisInventario/stock-actual')
export const getStockBajo   = () => api.get('/MisInventario/stock-bajo')

// Operaciones
export const getMovimientosPorUsuario     = () => api.get('/MisOperaciones/movimientos-por-usuario')
export const getEntradasSalidasPorInsumo  = () => api.get('/MisOperaciones/entradas-salidas-por-insumo')
export const getTotalCamas                = () => api.get('/MisOperaciones/total-camas')

// Proveedores
export const getProveedoresPorInsumo      = () => api.get('/MisProveedores/proveedores-por-insumo')
export const getProveedoresMayorCobertura = () => api.get('/MisProveedores/proveedores-mayor-cobertura')
