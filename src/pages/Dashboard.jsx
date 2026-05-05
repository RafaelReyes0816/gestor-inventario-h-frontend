import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import Seccion from '../components/Seccion'
import Tabla from '../components/Tabla'
import {
  getInsumosPorCategoriaConteo,
  getCantidadTotalPorAlmacen,
  getProximosAVencer,
  getInsumosMasSolicitados,
  getAlmacenesSinInsumos,
  getInsumosSinProveedor,
  getInsumosSinDistribucion,
  getTotalCamas,
  getProveedoresMayorCobertura,
  getMovimientosPorUsuario,
  getStockBajo,
} from '../services/misService'

function useFetch(fn) {
  const [data, setData] = useState([])
  const [cargando, setCargando] = useState(true)
  useEffect(() => {
    fn().then(r => setData(r.data)).catch(() => setData([])).finally(() => setCargando(false))
  }, [])
  return { data, cargando }
}

export default function Dashboard() {
  const categorias       = useFetch(getInsumosPorCategoriaConteo)
  const almacenes        = useFetch(getCantidadTotalPorAlmacen)
  const vencimientos     = useFetch(getProximosAVencer)
  const solicitados      = useFetch(getInsumosMasSolicitados)
  const almacenesSin     = useFetch(getAlmacenesSinInsumos)
  const sinProveedor     = useFetch(getInsumosSinProveedor)
  const sinDistribucion  = useFetch(getInsumosSinDistribucion)
  const [camasData, setCamasData] = useState({ totalCamas: 0, registros: [] })
  const [camasCargando, setCamasCargando] = useState(true)
  useEffect(() => {
    getTotalCamas()
      .then(r => setCamasData(r.data))
      .catch(() => setCamasData({ totalCamas: 0, registros: [] }))
      .finally(() => setCamasCargando(false))
  }, [])
  const proveedores      = useFetch(getProveedoresMayorCobertura)
  const movimientos      = useFetch(getMovimientosPorUsuario)

  const [stockBajoData, setStockBajoData] = useState({ total: 0, alertas: [] })
  const [stockBajoCargando, setStockBajoCargando] = useState(true)

  useEffect(() => {
    getStockBajo()
      .then(r => setStockBajoData(r.data))
      .catch(() => setStockBajoData({ total: 0, alertas: [] }))
      .finally(() => setStockBajoCargando(false))
  }, [])

  const totalInsumos     = categorias.data.reduce((a, c) => a + c.totalInsumos, 0)
  const totalUnidades    = almacenes.data.reduce((a, c) => a + c.cantidadTotal, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Tarjetas de resumen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <StatCard
            titulo="Total de insumos"
            valor={categorias.cargando ? '...' : totalInsumos}
            subtitulo="Insumos activos en el sistema"
            color="#0369a1"
          />
          <StatCard
            titulo="Categorías"
            valor={categorias.cargando ? '...' : categorias.data.length}
            subtitulo="Categorías con insumos activos"
            color="#7c3aed"
          />
          <StatCard
            titulo="Unidades en almacenes"
            valor={almacenes.cargando ? '...' : totalUnidades.toLocaleString()}
            subtitulo="Suma total de movimientos"
            color="#059669"
          />
          <StatCard
            titulo="Próximos a vencer"
            valor={vencimientos.cargando ? '...' : vencimientos.data.length}
            subtitulo="Vencen en los próximos 90 días"
            color="#dc2626"
          />
          <StatCard
            titulo="Almacenes sin insumos"
            valor={almacenesSin.cargando ? '...' : almacenesSin.data.length}
            subtitulo="Sin distribución activa"
            color="#d97706"
          />
          <StatCard
            titulo="Total de camas"
            valor={camasCargando ? '...' : camasData.totalCamas.toLocaleString()}
            subtitulo="Camas disponibles"
            color="#0891b2"
          />
          <StatCard
            titulo="Stock bajo"
            valor={stockBajoCargando ? '...' : stockBajoData.total}
            subtitulo="Insumos con stock menor a 20 uds."
            color="#b91c1c"
          />
        </div>

        {/* Stock bajo — alerta */}
        <Seccion
          titulo="Alertas de stock bajo"
          descripcion="Insumos con stock actual menor o igual a 20 unidades"
          alerta
        >
          <Tabla
            vacio="Todos los insumos tienen stock suficiente"
            columnas={[
              { key: 'codigoInsumo',  label: 'Código' },
              { key: 'nombreInsumo',  label: 'Insumo' },
              { key: 'codigoAlmacen', label: 'Almacén' },
              { key: 'nombreAlmacen', label: 'Nombre almacén' },
              {
                key: 'stockActual',
                label: 'Stock actual',
                render: (v, row) => (
                  <span style={{ fontWeight: 700, color: row.critico ? '#dc2626' : '#d97706' }}>
                    {v} {row.critico ? '(AGOTADO)' : ''}
                  </span>
                ),
              },
            ]}
            datos={stockBajoData.alertas ?? []}
          />
        </Seccion>

        {/* Insumos próximos a vencer — alerta */}
        <Seccion
          titulo="Insumos próximos a vencer"
          descripcion="Lotes con vencimiento dentro de los próximos 90 días ordenados por fecha"
          alerta
        >
          <Tabla
            vacio="No hay insumos por vencer en los próximos 90 días"
            columnas={[
              { key: 'codigoInsumo',  label: 'Código' },
              { key: 'nombreInsumo',  label: 'Insumo' },
              { key: 'nombreAlmacen', label: 'Almacén' },
              { key: 'lote',          label: 'Lote' },
              { key: 'cantidad',      label: 'Cantidad' },
              {
                key: 'fechaVencimiento',
                label: 'Vence el',
                render: (v) => {
                  const fecha = new Date(v)
                  const hoy = new Date()
                  const dias = Math.ceil((fecha - hoy) / 86400000)
                  const color = dias <= 30 ? '#ef4444' : dias <= 60 ? '#d97706' : '#374151'
                  return (
                    <span style={{ color, fontWeight: 600 }}>
                      {fecha.toLocaleDateString('es-BO')} ({dias}d)
                    </span>
                  )
                },
              },
            ]}
            datos={vencimientos.data}
          />
        </Seccion>

        {/* Dos columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Insumos más solicitados */}
          <Seccion
            titulo="Insumos más solicitados"
            descripcion="Ranking por frecuencia y volumen de movimientos"
          >
            <Tabla
              columnas={[
                { key: 'codigoInsumo', label: 'Código' },
                { key: 'nombreInsumo', label: 'Insumo' },
                { key: 'totalMovimientos', label: 'Movimientos' },
                { key: 'cantidadTotal',    label: 'Unidades' },
              ]}
              datos={solicitados.data}
            />
          </Seccion>

          {/* Insumos por categoría */}
          <Seccion
            titulo="Insumos por categoría"
            descripcion="Cantidad de insumos registrados en cada categoría"
          >
            <Tabla
              columnas={[
                { key: 'codigoCategoria', label: 'Código' },
                { key: 'nombreCategoria', label: 'Categoría' },
                { key: 'totalInsumos',    label: 'Total' },
              ]}
              datos={categorias.data}
            />
          </Seccion>

        </div>

        {/* Dos columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Proveedores con mayor cobertura */}
          <Seccion
            titulo="Proveedores con mayor cobertura"
            descripcion="Proveedores que suministran más variedad de insumos"
          >
            <Tabla
              columnas={[
                { key: 'codigoProveedor',        label: 'Código' },
                { key: 'nombreProveedor',         label: 'Proveedor' },
                { key: 'totalInsumosSuministrados', label: 'Insumos' },
              ]}
              datos={proveedores.data}
            />
          </Seccion>

          {/* Stock de camas */}
          <Seccion
            titulo="Stock de camas"
            descripcion="Registros de camas disponibles en el hospital"
          >
            <Tabla
              vacio="No hay registros de camas"
              columnas={[
                { key: 'codigo',   label: 'Código' },
                { key: 'cantidad', label: 'Cantidad' },
              ]}
              datos={camasData.registros}
            />
          </Seccion>

        </div>

        {/* Cantidad total por almacén */}
        <Seccion
          titulo="Unidades movidas por almacén"
          descripcion="Suma total de unidades registradas en movimientos para cada almacén"
        >
          <Tabla
            columnas={[
              { key: 'codigoAlmacen', label: 'Código' },
              { key: 'nombreAlmacen', label: 'Almacén' },
              { key: 'cantidadTotal', label: 'Unidades totales' },
            ]}
            datos={almacenes.data}
          />
        </Seccion>

        {/* Dos columnas — alertas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Insumos sin proveedor */}
          <Seccion
            titulo="Insumos sin proveedor asignado"
            descripcion="Insumos que no tienen ningún proveedor autorizado en el sistema"
            alerta
          >
            <Tabla
              vacio="Todos los insumos tienen proveedor asignado"
              columnas={[
                { key: 'codigoInsumo', label: 'Código' },
                { key: 'nombreInsumo', label: 'Insumo' },
                { key: 'descripcion',  label: 'Descripción' },
              ]}
              datos={sinProveedor.data}
            />
          </Seccion>

          {/* Insumos sin distribución */}
          <Seccion
            titulo="Insumos sin distribución a almacén"
            descripcion="Insumos registrados que no están asignados a ningún almacén"
            alerta
          >
            <Tabla
              vacio="Todos los insumos están distribuidos en almacenes"
              columnas={[
                { key: 'codigoInsumo', label: 'Código' },
                { key: 'nombreInsumo', label: 'Insumo' },
                { key: 'descripcion',  label: 'Descripción' },
              ]}
              datos={sinDistribucion.data}
            />
          </Seccion>

        </div>

        {/* Historial de movimientos por usuario */}
        <Seccion
          titulo="Historial de movimientos por usuario"
          descripcion="Registro de todos los movimientos con el usuario que los registró"
        >
          <Tabla
            columnas={[
              { key: 'codigoUsuario',    label: 'Cód. Usuario' },
              { key: 'nombreUsuario',    label: 'Usuario' },
              { key: 'rol',              label: 'Rol' },
              { key: 'codigoMovimiento', label: 'Cód. Movimiento' },
              { key: 'tipoMovimiento',   label: 'Tipo' },
              {
                key: 'fecha',
                label: 'Fecha',
                render: (v) => new Date(v).toLocaleDateString('es-BO'),
              },
            ]}
            datos={movimientos.data}
          />
        </Seccion>

    </div>
  )
}
