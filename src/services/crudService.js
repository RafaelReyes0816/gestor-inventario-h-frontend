import api from './api'

// Categorías
export const getCategorias    = ()           => api.get('/Categorias')
export const postCategoria    = (data)       => api.post('/Categorias', data)
export const putCategoria     = (codigo, data) => api.put(`/Categorias/${codigo}`, data)
export const deleteCategoria  = (codigo)    => api.delete(`/Categorias/${codigo}`)

// Proveedores
export const getProveedores   = ()           => api.get('/Proveedores')
export const postProveedor    = (data)       => api.post('/Proveedores', data)
export const putProveedor     = (codigo, data) => api.put(`/Proveedores/${codigo}`, data)
export const deleteProveedor  = (codigo)    => api.delete(`/Proveedores/${codigo}`)

// Almacenes
export const getAlmacenes     = ()           => api.get('/Almacenes')
export const postAlmacen      = (data)       => api.post('/Almacenes', data)
export const putAlmacen       = (codigo, data) => api.put(`/Almacenes/${codigo}`, data)
export const deleteAlmacen    = (codigo)    => api.delete(`/Almacenes/${codigo}`)

// Insumos
export const getInsumos       = ()           => api.get('/Insumos')
export const postInsumo       = (data)       => api.post('/Insumos', data)
export const putInsumo        = (codigo, data) => api.put(`/Insumos/${codigo}`, data)
export const deleteInsumo     = (codigo)    => api.delete(`/Insumos/${codigo}`)

// Camas
export const getCamas         = ()           => api.get('/Camas')
export const postCama         = (data)       => api.post('/Camas', data)
export const putCama          = (codigo, data) => api.put(`/Camas/${codigo}`, data)
export const deleteCama       = (codigo)    => api.delete(`/Camas/${codigo}`)

// Usuarios
export const getUsuarios      = ()           => api.get('/Usuarios')
export const postUsuario      = (data)       => api.post('/Usuarios', data)
export const putUsuario       = (codigo, data) => api.put(`/Usuarios/${codigo}`, data)
export const deleteUsuario    = (codigo)    => api.delete(`/Usuarios/${codigo}`)

// Distribuciones (Insumo ↔ Almacén)
export const getDistribuciones  = ()           => api.get('/Distribuciones')
export const postDistribucion   = (data)       => api.post('/Distribuciones/crear', data)
export const deleteDistribucion = (codigo)     => api.delete(`/Distribuciones/${codigo}`)

// Suministros (Insumo ↔ Proveedor)
export const getSuministros   = ()             => api.get('/Suministros')
export const postSuministro   = (data)         => api.post('/Suministros/crear', data)
export const deleteSuministro = (codigo)       => api.delete(`/Suministros/${codigo}`)

// Logísticas (Proveedor ↔ Almacén)
export const getLogisticas    = ()             => api.get('/Logisticas')
export const postLogistica    = (data)         => api.post('/Logisticas/crear', data)
export const deleteLogistica  = (codigo)       => api.delete(`/Logisticas/${codigo}`)

// Movimientos
export const postMovimiento   = (data)       => api.post('/Movimientos', data)

// Detalle Movimientos
export const postDetalle      = (data)       => api.post('/DetalleMovimientos', data)
export const getDetalles      = ()           => api.get('/DetalleMovimientos')

// Stock actual (MIS)
export const getStockActual   = ()           => api.get('/MisInventario/stock-actual')
