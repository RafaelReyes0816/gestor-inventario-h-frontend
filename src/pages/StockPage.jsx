import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { postMovimiento, postDetalle, getStockActual, getUsuarios, getInsumos, getAlmacenes, getProveedores, getSuministros, getDistribuciones } from '../services/crudService'
import { mensajeDesdeAxios, erroresCamposDesdeAxios } from '../utils/mensajeErrorApi'
import { validarStockMovimiento } from '../utils/validacionesStock'

// Genera un código único combinando timestamp + sufijo aleatorio
const genCodigo = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

const FORM_INIT = {
  tipo: 'Entrada',
  codigoUsuario: '',
  codigoInsumo: '',
  codigoAlmacen: '',
  codigoProveedor: '',
  lote: '',
  fechaVencimiento: '',
  cantidad: '',
}

export default function StockPage() {
  const [form, setForm]           = useState(FORM_INIT)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje]     = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [stock, setStock]         = useState([])
  const [cargandoStock, setCargandoStock] = useState(true)
  const [filtro, setFiltro]       = useState('')

  // Datos auxiliares para filtrado contextual
  const [todosProveedores, setTodosProveedores] = useState([])
  const [todosAlmacenes,   setTodosAlmacenes]   = useState([])
  const [suministros,      setSuministros]       = useState([])
  const [distribuciones,   setDistribuciones]    = useState([])

  const cargarStock = useCallback(() => {
    setCargandoStock(true)
    getStockActual()
      .then(r => setStock(r.data))
      .catch(() => setStock([]))
      .finally(() => setCargandoStock(false))
  }, [])

  useEffect(() => { cargarStock() }, [cargarStock])

  useEffect(() => {
    getProveedores()   .then(r => setTodosProveedores(r.data)).catch(() => {})
    getAlmacenes()     .then(r => setTodosAlmacenes(r.data))  .catch(() => {})
    getSuministros()   .then(r => setSuministros(r.data))     .catch(() => {})
    getDistribuciones().then(r => setDistribuciones(r.data))  .catch(() => {})
  }, [])

  // Opciones filtradas según el insumo seleccionado
  // Almacenes: usa Distribuciones (qué almacenes tienen registrado ese insumo)
  const almacenesOpciones = useMemo(() => {
    if (!form.codigoInsumo || !distribuciones.length || !todosAlmacenes.length) return null
    const codigos = new Set(
      distribuciones
        .filter(d => d.codigoInsumo === form.codigoInsumo)
        .map(d => d.codigoAlmacen)
    )
    const filtrados = todosAlmacenes.filter(a => codigos.has(a.codigo))
    return filtrados.length ? filtrados : null
  }, [form.codigoInsumo, distribuciones, todosAlmacenes])

  // Proveedores: usa Suministros (qué proveedores suministran ese insumo)
  const proveedoresOpciones = useMemo(() => {
    if (!form.codigoInsumo || !suministros.length || !todosProveedores.length) return null
    const codigos = new Set(
      suministros
        .filter(s => s.codigoInsumo === form.codigoInsumo)
        .map(s => s.codigoProveedor)
    )
    const filtrados = todosProveedores.filter(p => codigos.has(p.codigo))
    return filtrados.length ? filtrados : null
  }, [form.codigoInsumo, suministros, todosProveedores])

  // Auto-seleccionar cuando solo hay una opción disponible
  useEffect(() => {
    if (almacenesOpciones?.length === 1)
      setForm(p => ({ ...p, codigoAlmacen: almacenesOpciones[0].codigo }))
  }, [almacenesOpciones])

  useEffect(() => {
    if (proveedoresOpciones?.length === 1)
      setForm(p => ({ ...p, codigoProveedor: proveedoresOpciones[0].codigo }))
  }, [proveedoresOpciones])

  const cargandoAux = !todosAlmacenes.length || !todosProveedores.length

  // Opciones finales: filtradas si hay insumo seleccionado, todas si no
  const opcionesAlmacen   = form.codigoInsumo ? (almacenesOpciones   ?? todosAlmacenes)   : todosAlmacenes
  const opcionesProveedor = form.codigoInsumo ? (proveedoresOpciones ?? todosProveedores) : todosProveedores
  const esFiltradoAlmacen   = !!(form.codigoInsumo && almacenesOpciones)
  const esFiltradoProveedor = !!(form.codigoInsumo && proveedoresOpciones)

  const mostrarMensaje = (texto, tipo = 'ok') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 4000)
  }

  const handleChange = (e) => {
    const { name } = e.target
    setForm(prev => ({ ...prev, [name]: e.target.value }))
    setFieldErrors(prev => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  // Al cambiar el insumo, limpiar almacén y proveedor para que se recalculen
  const handleInsumoChange = (e) => {
    setFieldErrors(prev => {
      const next = { ...prev }
      delete next.codigoInsumo
      delete next.codigoAlmacen
      delete next.codigoProveedor
      return next
    })
    setForm(prev => ({ ...prev, codigoInsumo: e.target.value, codigoAlmacen: '', codigoProveedor: '' }))
  }

  const esEntrada   = form.tipo === 'Entrada'

  const registrar = async (e) => {
    e.preventDefault()
    const locales = validarStockMovimiento(form, esEntrada)
    if (Object.keys(locales).length > 0) {
      setFieldErrors(locales)
      mostrarMensaje('Revisá los campos marcados.', 'error')
      return
    }
    setFieldErrors({})

    setGuardando(true)
    try {
      const codMov = genCodigo('MOV')
      await postMovimiento({
        codigo: codMov,
        tipoMovimiento: form.tipo,
        codigoUsuario: form.codigoUsuario,
      })

      const codDet = genCodigo('DET')
      await postDetalle({
        codigo: codDet,
        codigoMovimiento: codMov,
        codigoInsumo: form.codigoInsumo,
        codigoProveedor: form.codigoProveedor,
        codigoAlmacen: form.codigoAlmacen,
        lote: esEntrada ? form.lote : `SALIDA-${Date.now()}`,
        ...(esEntrada && { fechaVencimiento: form.fechaVencimiento }),
        cantidad: Number(form.cantidad),
      })

      mostrarMensaje(`${form.tipo} registrada correctamente (${form.cantidad} unidades de ${form.codigoInsumo})`)
      setForm(FORM_INIT)
      setFieldErrors({})
      cargarStock()
    } catch (err) {
      const delServidor = erroresCamposDesdeAxios(err)
      if (Object.keys(delServidor).length > 0)
        setFieldErrors(prev => ({ ...prev, ...delServidor }))
      mostrarMensaje(mensajeDesdeAxios(err), 'error')
    } finally {
      setGuardando(false)
    }
  }

  const stockFiltrado = stock.filter(s =>
    s.codigoInsumo?.toLowerCase().includes(filtro.toLowerCase()) ||
    s.nombreInsumo?.toLowerCase().includes(filtro.toLowerCase()) ||
    s.codigoAlmacen?.toLowerCase().includes(filtro.toLowerCase()) ||
    s.nombreAlmacen?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', alignItems: 'start' }}>

      {/* ── Panel izquierdo: formulario ── */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.10)', padding: '24px',
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
          Registrar movimiento de stock
        </h3>

        {mensaje && (
          <div style={{
            padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px',
            background: mensaje.tipo === 'error' ? '#fef2f2' : '#f0fdf4',
            color:      mensaje.tipo === 'error' ? '#dc2626' : '#16a34a',
            border: `1px solid ${mensaje.tipo === 'error' ? '#fecaca' : '#bbf7d0'}`,
          }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={registrar} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Tipo de movimiento */}
          <div>
            <label style={labelStyle}>Tipo de movimiento</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Entrada', 'Salida'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setForm(p => ({ ...p, tipo: t }))
                    setFieldErrors({})
                  }}
                  style={{
                    flex: 1, padding: '10px', border: '2px solid',
                    borderColor: form.tipo === t
                      ? (t === 'Entrada' ? '#16a34a' : '#dc2626')
                      : '#e5e7eb',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 700,
                    fontSize: '14px',
                    background: form.tipo === t
                      ? (t === 'Entrada' ? '#f0fdf4' : '#fef2f2')
                      : '#fff',
                    color: form.tipo === t
                      ? (t === 'Entrada' ? '#16a34a' : '#dc2626')
                      : '#6b7280',
                    transition: 'all 0.15s',
                  }}
                >
                  {t === 'Entrada' ? '+ Entrada' : '- Salida'}
                </button>
              ))}
            </div>
          </div>

          <Select
            label="Usuario"   name="codigoUsuario"   value={form.codigoUsuario}
            fetchFn={getUsuarios}
            getLabel={(u) => `${u.codigo} — ${u.nombre} (${u.rol})`}
            getValue={(u) => u.codigo}
            onChange={handleChange}
            error={fieldErrors.codigoUsuario}
          />
          <Select
            label="Insumo"    name="codigoInsumo"    value={form.codigoInsumo}
            fetchFn={getInsumos}
            getLabel={(i) => `${i.codigo} — ${i.nombre}`}
            getValue={(i) => i.codigo}
            onChange={handleInsumoChange}
            error={fieldErrors.codigoInsumo}
          />
          <SelectOpciones
            label="Almacén"
            name="codigoAlmacen"
            value={form.codigoAlmacen}
            opciones={opcionesAlmacen}
            cargando={cargandoAux}
            filtrado={esFiltradoAlmacen}
            getLabel={(a) => `${a.codigo} — ${a.nombre}`}
            getValue={(a) => a.codigo}
            onChange={handleChange}
            error={fieldErrors.codigoAlmacen}
          />
          <SelectOpciones
            label="Proveedor"
            name="codigoProveedor"
            value={form.codigoProveedor}
            opciones={opcionesProveedor}
            cargando={cargandoAux}
            filtrado={esFiltradoProveedor}
            getLabel={(p) => `${p.codigo} — ${p.nombre}`}
            getValue={(p) => p.codigo}
            onChange={handleChange}
            error={fieldErrors.codigoProveedor}
          />
          {esEntrada && (
            <>
              <Campo label="Lote" name="lote" value={form.lote} onChange={handleChange} placeholder="LOTE-A" error={fieldErrors.lote} />
              <div>
                <label style={labelStyle}>Fecha de vencimiento</label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={form.fechaVencimiento}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    border: `1px solid ${fieldErrors.fechaVencimiento ? '#ef4444' : '#d1d5db'}`,
                  }}
                />
                {fieldErrors.fechaVencimiento && (
                  <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500, display: 'block', marginTop: '4px' }}>
                    {fieldErrors.fechaVencimiento}
                  </span>
                )}
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Cantidad</label>
            <input
              type="number"
              name="cantidad"
              min="1"
              step="1"
              value={form.cantidad}
              onChange={handleChange}
              placeholder="50"
              style={{
                ...inputStyle, fontSize: '18px', fontWeight: 700,
                color: form.tipo === 'Entrada' ? '#16a34a' : '#dc2626',
                borderColor: fieldErrors.cantidad ? '#ef4444' : '#d1d5db',
              }}
            />
            {fieldErrors.cantidad && (
              <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500, display: 'block', marginTop: '4px' }}>
                {fieldErrors.cantidad}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={guardando}
            style={{
              padding: '12px', borderRadius: '8px', border: 'none',
              background: form.tipo === 'Entrada' ? '#16a34a' : '#dc2626',
              color: '#fff', fontWeight: 700, fontSize: '15px',
              cursor: guardando ? 'not-allowed' : 'pointer',
              opacity: guardando ? 0.7 : 1, marginTop: '4px',
              transition: 'background 0.15s',
            }}
          >
            {guardando ? 'Registrando...' : `Registrar ${form.tipo}`}
          </button>
        </form>
      </div>

      {/* ── Panel derecho: tabla de stock actual ── */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.10)', padding: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
            Stock actual por insumo / almacén
          </h3>
          <button
            onClick={cargarStock}
            style={{
              padding: '7px 16px', borderRadius: '7px', border: '1px solid #bae6fd',
              background: '#f0f9ff', color: '#0369a1', fontWeight: 600,
              cursor: 'pointer', fontSize: '13px',
            }}
          >
            Actualizar
          </button>
        </div>

        <input
          type="text"
          placeholder="Filtrar por insumo o almacén..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ ...inputStyle, marginBottom: '16px' }}
        />

        {cargandoStock ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando stock...</p>
        ) : stockFiltrado.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {stock.length === 0 ? 'Sin movimientos registrados aún.' : 'Sin resultados para el filtro.'}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  {['Insumo', 'Almacén', 'Entradas', 'Salidas', 'Stock actual'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockFiltrado.map((s, i) => {
                  const stockNegativo = s.stockActual < 0
                  const stockBajo     = s.stockActual >= 0 && s.stockActual <= 5
                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                    >
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{s.nombreInsumo}</div>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>{s.codigoInsumo}</div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 500 }}>{s.nombreAlmacen}</div>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>{s.codigoAlmacen}</div>
                      </td>
                      <td style={{ ...tdStyle, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
                        +{s.entradas}
                      </td>
                      <td style={{ ...tdStyle, color: '#dc2626', fontWeight: 600, textAlign: 'center' }}>
                        -{s.salidas}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', padding: '4px 14px', borderRadius: '20px',
                          fontWeight: 700, fontSize: '14px',
                          background: stockNegativo ? '#fef2f2' : stockBajo ? '#fef9c3' : '#f0fdf4',
                          color:      stockNegativo ? '#dc2626' : stockBajo ? '#854d0e' : '#16a34a',
                        }}>
                          {s.stockActual}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Select controlado por el padre (sin fetch interno) ───────────────────────
function SelectOpciones({ label, name, value, onChange, opciones, cargando, filtrado, getLabel, getValue, error }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={e => onChange({ target: { name, value: e.target.value } })}
        disabled={cargando}
        style={{
          ...inputStyle,
          cursor: cargando ? 'not-allowed' : 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '36px',
          borderColor: error ? '#ef4444' : filtrado ? '#a5f3fc' : '#d1d5db',
          background:  filtrado ? '#f0fdff' : '#fafafa',
        }}
      >
        <option value="">
          {cargando ? 'Cargando...' : `— Seleccionar ${label.toLowerCase()} —`}
        </option>
        {(opciones ?? []).map((item, i) => (
          <option key={i} value={getValue(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500, display: 'block', marginTop: '4px' }}>
          {error}
        </span>
      )}
      {filtrado && opciones?.length > 0 && !error && (
        <span style={{ fontSize: '11px', color: '#0891b2', marginTop: '3px', display: 'block' }}>
          Filtrado por insumo seleccionado ({opciones.length} opción{opciones.length !== 1 ? 'es' : ''})
        </span>
      )}
    </div>
  )
}

// ── Campo de texto simple ────────────────────────────────────────────────────
function Campo({ label, name, value, onChange, placeholder, error }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
        }}
      />
      {error && (
        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500, display: 'block', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  )
}

// ── Select con carga dinámica desde API (o con opciones externas) ─────────────
function Select({ label, name, value, onChange, fetchFn, opciones: opcionesExternas, getLabel, getValue, error }) {
  const [opcionesInternas, setOpcionesInternas] = useState([])
  const [cargando, setCargando]                 = useState(true)
  const fetchRef                                = useRef(fetchFn)

  // Carga interna solo si no se pasan opciones externas
  useEffect(() => {
    let activo = true
    setCargando(true)
    fetchRef.current()
      .then(r => { if (activo) setOpcionesInternas(r.data) })
      .catch(() => { if (activo) setOpcionesInternas([]) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  // Si hay opciones externas las usamos directamente (filtradas por insumo)
  const opciones    = opcionesExternas ?? opcionesInternas
  const esFiltrado  = opcionesExternas !== null && opcionesExternas !== undefined
  const sinOpciones = esFiltrado && opciones.length === 0

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={e => onChange({ target: { name, value: e.target.value } })}
        disabled={cargando || sinOpciones}
        style={{
          ...inputStyle,
          cursor: (cargando || sinOpciones) ? 'not-allowed' : 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '36px',
          border: `1px solid ${error ? '#ef4444' : esFiltrado ? '#a5f3fc' : '#d1d5db'}`,
          background:  esFiltrado ? '#f0fdff' : '#fafafa',
        }}
      >
        <option value="">
          {cargando
            ? 'Cargando...'
            : sinOpciones
              ? '— Sin opciones para este insumo —'
              : `— Seleccionar ${label.split('(')[0].trim().toLowerCase()} —`}
        </option>
        {opciones.map((item, i) => (
          <option key={i} value={getValue(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500, display: 'block', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  )
}

// ── Estilos compartidos ──────────────────────────────────────────────────────
const labelStyle = {
  display: 'block', marginBottom: '5px',
  fontSize: '13px', fontWeight: 600, color: '#374151',
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '7px',
  border: '1px solid #d1d5db', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box', color: '#111827',
  background: '#fafafa',
}

const thStyle = {
  padding: '10px 14px', textAlign: 'left',
  fontWeight: 700, color: '#374151', fontSize: '12px',
  textTransform: 'uppercase', letterSpacing: '0.05em',
}

const tdStyle = {
  padding: '10px 14px', verticalAlign: 'middle',
}
