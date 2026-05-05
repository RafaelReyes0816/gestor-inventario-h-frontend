import { useState, useEffect, useCallback } from 'react'
import Modal from '../components/Modal'
import Tabla from '../components/Tabla'
import Campo from '../components/Campo'
import CampoSelect from '../components/CampoSelect'
import {
  getCategorias, postCategoria, putCategoria, deleteCategoria,
  getProveedores, postProveedor, putProveedor, deleteProveedor,
  getAlmacenes, postAlmacen, putAlmacen, deleteAlmacen,
  getInsumos, postInsumo, putInsumo, deleteInsumo,
  getCamas, postCama, putCama, deleteCama,
  getUsuarios, postUsuario, putUsuario, deleteUsuario,
  getDistribuciones, postDistribucion, deleteDistribucion,
  getSuministros, postSuministro, deleteSuministro,
  getLogisticas, postLogistica, deleteLogistica,
} from '../services/crudService'

// ── Configuración de cada entidad ────────────────────────────────────────────
const ENTIDADES = [
  {
    key: 'categorias',
    label: 'Categorías',
    getAll: getCategorias,
    post: postCategoria,
    put: putCategoria,
    del: deleteCategoria,
    columnas: [
      { key: 'codigo', label: 'Código' },
      { key: 'nombre', label: 'Nombre' },
    ],
    camposCrear: [
      { name: 'codigo', label: 'Código', placeholder: 'CAT-001' },
      { name: 'nombre', label: 'Nombre', placeholder: 'Medicamentos' },
    ],
    camposEditar: [
      { name: 'nuevoNombre', label: 'Nuevo nombre', placeholder: 'Medicamentos' },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, nombre: f.nombre }),
    buildUpdate: (f) => ({ nuevoNombre: f.nuevoNombre }),
    initCreate: { codigo: '', nombre: '' },
    initUpdate: (row) => ({ nuevoNombre: row.nombre }),
  },
  {
    key: 'proveedores',
    label: 'Proveedores',
    getAll: getProveedores,
    post: postProveedor,
    put: putProveedor,
    del: deleteProveedor,
    columnas: [
      { key: 'codigo', label: 'Código' },
      { key: 'nombre', label: 'Nombre' },
    ],
    camposCrear: [
      { name: 'codigo', label: 'Código', placeholder: 'PROV-001' },
      { name: 'nombre', label: 'Nombre', placeholder: 'Proveedor SA' },
    ],
    camposEditar: [
      { name: 'nuevoNombre', label: 'Nuevo nombre', placeholder: 'Proveedor SA' },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, nombre: f.nombre }),
    buildUpdate: (f) => ({ nuevoNombre: f.nuevoNombre }),
    initCreate: { codigo: '', nombre: '' },
    initUpdate: (row) => ({ nuevoNombre: row.nombre }),
  },
  {
    key: 'almacenes',
    label: 'Almacenes',
    getAll: getAlmacenes,
    post: postAlmacen,
    put: putAlmacen,
    del: deleteAlmacen,
    columnas: [
      { key: 'codigo',    label: 'Código' },
      { key: 'nombre',    label: 'Nombre' },
      { key: 'ubicacion', label: 'Ubicación' },
    ],
    camposCrear: [
      { name: 'codigo',    label: 'Código',    placeholder: 'ALM-001' },
      { name: 'nombre',    label: 'Nombre',    placeholder: 'Almacén Central' },
      { name: 'ubicacion', label: 'Ubicación', placeholder: 'Planta baja, ala norte' },
    ],
    camposEditar: [
      { name: 'nuevoNombre',    label: 'Nuevo nombre',    placeholder: 'Almacén Central' },
      { name: 'nuevaUbicacion', label: 'Nueva ubicación', placeholder: 'Planta baja, ala norte' },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, nombre: f.nombre, ubicacion: f.ubicacion }),
    buildUpdate: (f) => ({ nuevoNombre: f.nuevoNombre, nuevaUbicacion: f.nuevaUbicacion }),
    initCreate: { codigo: '', nombre: '', ubicacion: '' },
    initUpdate: (row) => ({ nuevoNombre: row.nombre, nuevaUbicacion: row.ubicacion }),
  },
  {
    key: 'insumos',
    label: 'Insumos',
    getAll: getInsumos,
    post: postInsumo,
    put: putInsumo,
    del: deleteInsumo,
    columnas: [
      { key: 'codigo',      label: 'Código' },
      { key: 'nombre',      label: 'Nombre' },
      { key: 'descripcion', label: 'Descripción' },
    ],
    camposCrear: [
      { name: 'codigo',          label: 'Código',        placeholder: 'INS-001' },
      { name: 'nombre',          label: 'Nombre',        placeholder: 'Alcohol 96°' },
      { name: 'descripcion',     label: 'Descripción',   placeholder: 'Alcohol isopropílico...' },
      {
        name: 'codigoCategoria', label: 'Categoría',
        tipo: 'select',
        fetchFn: getCategorias,
        getLabel: (c) => `${c.codigo} — ${c.nombre}`,
        getValue: (c) => c.codigo,
      },
    ],
    camposEditar: [
      { name: 'nuevoNombre',      label: 'Nuevo nombre',      placeholder: 'Alcohol 96°' },
      { name: 'nuevaDescripcion', label: 'Nueva descripción', placeholder: 'Alcohol isopropílico...' },
      {
        name: 'codigoCategoria', label: 'Categoría',
        tipo: 'select',
        fetchFn: getCategorias,
        getLabel: (c) => `${c.codigo} — ${c.nombre}`,
        getValue: (c) => c.codigo,
      },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, nombre: f.nombre, descripcion: f.descripcion, codigoCategoria: f.codigoCategoria }),
    buildUpdate: (f) => ({ nuevoNombre: f.nuevoNombre, nuevaDescripcion: f.nuevaDescripcion, codigoCategoria: f.codigoCategoria }),
    initCreate: { codigo: '', nombre: '', descripcion: '', codigoCategoria: '' },
    initUpdate: (row) => ({ nuevoNombre: row.nombre, nuevaDescripcion: row.descripcion, codigoCategoria: '' }),
  },
  {
    key: 'camas',
    label: 'Camas',
    getAll: getCamas,
    post: postCama,
    put: putCama,
    del: deleteCama,
    columnas: [
      { key: 'codigo',   label: 'Código' },
      { key: 'cantidad', label: 'Stock (camas)' },
    ],
    camposCrear: [
      { name: 'codigo',   label: 'Código',         placeholder: 'CAM-001' },
      { name: 'cantidad', label: 'Cantidad',        placeholder: '50', type: 'number' },
    ],
    camposEditar: [
      { name: 'nuevaCantidad', label: 'Nueva cantidad', placeholder: '50', type: 'number' },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, cantidad: Number(f.cantidad) }),
    buildUpdate: (f) => ({ nuevaCantidad: Number(f.nuevaCantidad) }),
    initCreate: { codigo: '', cantidad: '' },
    initUpdate: (row) => ({ nuevaCantidad: row.cantidad }),
  },
  {
    key: 'usuarios',
    label: 'Usuarios',
    getAll: getUsuarios,
    post: postUsuario,
    put: putUsuario,
    del: deleteUsuario,
    columnas: [
      { key: 'codigo', label: 'Código' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'rol',    label: 'Rol' },
    ],
    camposCrear: [
      { name: 'codigo', label: 'Código', placeholder: 'USR-001' },
      { name: 'nombre', label: 'Nombre', placeholder: 'Juan Pérez' },
      { name: 'rol',    label: 'Rol',    placeholder: 'Logística' },
    ],
    camposEditar: [
      { name: 'nuevoNombre', label: 'Nuevo nombre', placeholder: 'Juan Pérez' },
      { name: 'nuevoRol',    label: 'Nuevo rol',    placeholder: 'Logística' },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, nombre: f.nombre, rol: f.rol }),
    buildUpdate: (f) => ({ nuevoNombre: f.nuevoNombre, nuevoRol: f.nuevoRol }),
    initCreate: { codigo: '', nombre: '', rol: '' },
    initUpdate: (row) => ({ nuevoNombre: row.nombre, nuevoRol: row.rol }),
  },

  // ── Relaciones 5FN ──────────────────────────────────────────────────────────
  {
    key: 'distribuciones',
    label: 'Distribuciones',
    grupo: 'relaciones',
    getAll: getDistribuciones,
    post: postDistribucion,
    del: deleteDistribucion,
    sinEdicion: true,
    columnas: [
      { key: 'codigo',        label: 'Código' },
      { key: 'codigoInsumo',  label: 'Insumo' },
      { key: 'codigoAlmacen', label: 'Almacén' },
    ],
    camposCrear: [
      { name: 'codigo', label: 'Código', placeholder: 'DIS-001' },
      {
        name: 'codigoInsumo', label: 'Insumo',
        tipo: 'select',
        fetchFn: getInsumos,
        getLabel: (i) => `${i.codigo} — ${i.nombre}`,
        getValue: (i) => i.codigo,
      },
      {
        name: 'codigoAlmacen', label: 'Almacén',
        tipo: 'select',
        fetchFn: getAlmacenes,
        getLabel: (a) => `${a.codigo} — ${a.nombre}`,
        getValue: (a) => a.codigo,
      },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, codigoInsumo: f.codigoInsumo, codigoAlmacen: f.codigoAlmacen }),
    initCreate: { codigo: '', codigoInsumo: '', codigoAlmacen: '' },
  },
  {
    key: 'suministros',
    label: 'Suministros',
    grupo: 'relaciones',
    getAll: getSuministros,
    post: postSuministro,
    del: deleteSuministro,
    sinEdicion: true,
    columnas: [
      { key: 'codigo',          label: 'Código' },
      { key: 'codigoInsumo',    label: 'Insumo' },
      { key: 'codigoProveedor', label: 'Proveedor' },
    ],
    camposCrear: [
      { name: 'codigo', label: 'Código', placeholder: 'SUM-001' },
      {
        name: 'codigoInsumo', label: 'Insumo',
        tipo: 'select',
        fetchFn: getInsumos,
        getLabel: (i) => `${i.codigo} — ${i.nombre}`,
        getValue: (i) => i.codigo,
      },
      {
        name: 'codigoProveedor', label: 'Proveedor',
        tipo: 'select',
        fetchFn: getProveedores,
        getLabel: (p) => `${p.codigo} — ${p.nombre}`,
        getValue: (p) => p.codigo,
      },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, codigoInsumo: f.codigoInsumo, codigoProveedor: f.codigoProveedor }),
    initCreate: { codigo: '', codigoInsumo: '', codigoProveedor: '' },
  },
  {
    key: 'logisticas',
    label: 'Logísticas',
    grupo: 'relaciones',
    getAll: getLogisticas,
    post: postLogistica,
    del: deleteLogistica,
    sinEdicion: true,
    columnas: [
      { key: 'codigo',          label: 'Código' },
      { key: 'codigoProveedor', label: 'Proveedor' },
      { key: 'codigoAlmacen',   label: 'Almacén' },
    ],
    camposCrear: [
      { name: 'codigo', label: 'Código', placeholder: 'LOG-001' },
      {
        name: 'codigoProveedor', label: 'Proveedor',
        tipo: 'select',
        fetchFn: getProveedores,
        getLabel: (p) => `${p.codigo} — ${p.nombre}`,
        getValue: (p) => p.codigo,
      },
      {
        name: 'codigoAlmacen', label: 'Almacén',
        tipo: 'select',
        fetchFn: getAlmacenes,
        getLabel: (a) => `${a.codigo} — ${a.nombre}`,
        getValue: (a) => a.codigo,
      },
    ],
    buildCreate: (f) => ({ codigo: f.codigo, codigoProveedor: f.codigoProveedor, codigoAlmacen: f.codigoAlmacen }),
    initCreate: { codigo: '', codigoProveedor: '', codigoAlmacen: '' },
  },
]

// ── Componente de tabla con acciones CRUD ────────────────────────────────────
function TablaEntidad({ entidad }) {
  const [datos, setDatos]       = useState([])
  const [cargando, setCargando] = useState(true)
  const [modal, setModal]       = useState(null)  // null | 'crear' | 'editar'
  const [filaActual, setFilaActual] = useState(null)
  const [form, setForm]         = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje]   = useState(null)

  const cargar = useCallback(() => {
    setCargando(true)
    entidad.getAll()
      .then(r => setDatos(r.data))
      .catch(() => setDatos([]))
      .finally(() => setCargando(false))
  }, [entidad])

  useEffect(() => { cargar() }, [cargar])

  const mostrarMensaje = (texto, tipo = 'ok') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 3500)
  }

  const abrirCrear = () => {
    setForm(entidad.initCreate)
    setModal('crear')
  }

  const abrirEditar = (row) => {
    if (entidad.sinEdicion || !entidad.initUpdate) return
    setFilaActual(row)
    setForm(entidad.initUpdate(row))
    setModal('editar')
  }

  const cerrarModal = () => { setModal(null); setFilaActual(null) }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const guardar = async () => {
    setGuardando(true)
    try {
      if (modal === 'crear') {
        await entidad.post(entidad.buildCreate(form))
        mostrarMensaje('Registro creado correctamente')
      } else if (entidad.put && entidad.buildUpdate) {
        await entidad.put(filaActual.codigo, entidad.buildUpdate(form))
        mostrarMensaje('Registro actualizado correctamente')
      }
      cerrarModal()
      cargar()
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al guardar'
      mostrarMensaje(msg, 'error')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (row) => {
    if (!window.confirm(`¿Desactivar "${row.codigo}"? El registro quedará como inactivo.`)) return
    try {
      await entidad.del(row.codigo)
      mostrarMensaje('Registro desactivado correctamente')
      cargar()
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al eliminar'
      mostrarMensaje(msg, 'error')
    }
  }

  const columnas = [
    ...entidad.columnas,
    {
      key: '_acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {!entidad.sinEdicion && (
            <button
              onClick={() => abrirEditar(row)}
              style={{
                padding: '5px 14px', borderRadius: '6px', border: '1px solid #bae6fd',
                background: '#f0f9ff', color: '#0369a1', fontWeight: 600,
                cursor: 'pointer', fontSize: '13px',
              }}
            >
              Editar
            </button>
          )}
          <button
            onClick={() => eliminar(row)}
            style={{
              padding: '5px 14px', borderRadius: '6px', border: '1px solid #fecaca',
              background: '#fef2f2', color: '#dc2626', fontWeight: 600,
              cursor: 'pointer', fontSize: '13px',
            }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  const camposActuales = (modal === 'crear' ? entidad.camposCrear : entidad.camposEditar) ?? []

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>
          {cargando ? 'Cargando...' : `${datos.length} registro${datos.length !== 1 ? 's' : ''}`}
        </span>
        <button
          onClick={abrirCrear}
          style={{
            padding: '9px 20px', borderRadius: '8px', border: 'none',
            background: '#0369a1', color: '#fff', fontWeight: 700,
            cursor: 'pointer', fontSize: '14px',
            boxShadow: '0 2px 6px rgba(3,105,161,0.30)',
          }}
        >
          + Nuevo registro
        </button>
      </div>

      {/* Mensaje de feedback */}
      {mensaje && (
        <div style={{
          padding: '10px 16px', borderRadius: '8px', marginBottom: '16px',
          background: mensaje.tipo === 'error' ? '#fef2f2' : '#f0fdf4',
          color: mensaje.tipo === 'error' ? '#dc2626' : '#16a34a',
          border: `1px solid ${mensaje.tipo === 'error' ? '#fecaca' : '#bbf7d0'}`,
          fontSize: '14px', fontWeight: 500,
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <Tabla columnas={columnas} datos={datos} />
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          titulo={modal === 'crear' ? `Nuevo registro — ${entidad.label}` : `Editar — ${filaActual?.codigo}`}
          onCerrar={cerrarModal}
          onGuardar={guardar}
          cargando={guardando}
        >
          {camposActuales.map(c =>
            c.tipo === 'select' ? (
              <CampoSelect
                key={c.name}
                name={c.name}
                label={c.label}
                value={form[c.name] ?? ''}
                onChange={handleChange}
                fetchFn={c.fetchFn}
                getLabel={c.getLabel}
                getValue={c.getValue}
                requerido
              />
            ) : (
              <Campo
                key={c.name}
                name={c.name}
                label={c.label}
                placeholder={c.placeholder}
                value={form[c.name] ?? ''}
                onChange={handleChange}
                type={c.type ?? 'text'}
                requerido
              />
            )
          )}
        </Modal>
      )}
    </div>
  )
}

// ── Página principal de gestión ──────────────────────────────────────────────
const ENTIDADES_BASE      = ENTIDADES.filter(e => !e.grupo)
const ENTIDADES_RELACION  = ENTIDADES.filter(e => e.grupo === 'relaciones')

export default function GestionPage() {
  const [tabActiva, setTabActiva] = useState('categorias')
  const entidadActiva = ENTIDADES.find(e => e.key === tabActiva)

  const btnTab = (e) => (
    <button
      key={e.key}
      onClick={() => setTabActiva(e.key)}
      style={{
        padding: '8px 16px', border: 'none', cursor: 'pointer',
        background: tabActiva === e.key ? '#f0f9ff' : 'none',
        fontWeight: 600, fontSize: '13px',
        color: tabActiva === e.key ? '#0369a1' : '#64748b',
        borderBottom: tabActiva === e.key ? '2px solid #0369a1' : '2px solid transparent',
        marginBottom: '-2px', borderRadius: '6px 6px 0 0',
        transition: 'all 0.15s',
      }}
    >
      {e.label}
    </button>
  )

  return (
    <div>
      {/* Grupo: entidades base */}
      <div style={{ marginBottom: '4px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, color: '#94a3b8',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          paddingLeft: '4px',
        }}>
          Entidades principales
        </span>
      </div>
      <div style={{
        display: 'flex', gap: '2px', flexWrap: 'wrap',
        borderBottom: '2px solid #e2e8f0', marginBottom: '8px',
      }}>
        {ENTIDADES_BASE.map(btnTab)}
      </div>

      {/* Grupo: relaciones 5FN */}
      <div style={{ marginBottom: '4px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, color: '#94a3b8',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          paddingLeft: '4px',
        }}>
          Relaciones (5FN)
        </span>
      </div>
      <div style={{
        display: 'flex', gap: '2px', flexWrap: 'wrap',
        borderBottom: '2px solid #e2e8f0', marginBottom: '24px',
      }}>
        {ENTIDADES_RELACION.map(btnTab)}
      </div>

      {/* Contenido de la tab activa */}
      {entidadActiva && <TablaEntidad key={tabActiva} entidad={entidadActiva} />}
    </div>
  )
}
