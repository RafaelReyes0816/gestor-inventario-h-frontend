import { useState, useEffect, useRef } from 'react'

/**
 * Campo de selección que carga sus opciones desde la API.
 *
 * Props:
 *   label       — etiqueta visible
 *   name        — nombre del campo (para el formulario)
 *   value       — valor actual
 *   onChange    — handler (recibe evento sintético { target: { name, value } })
 *   fetchFn     — función del servicio que devuelve la lista (ej: getInsumos)
 *   getLabel    — función que recibe un item y devuelve el texto a mostrar
 *                 ej: (i) => `${i.codigo} — ${i.nombre}`
 *   getValue    — función que recibe un item y devuelve el valor a guardar
 *                 ej: (i) => i.codigo
 *   requerido   — muestra asterisco
 */
export default function CampoSelect({
  label, name, value, onChange,
  fetchFn, getLabel, getValue,
  requerido = false,
  error,
}) {
  const [opciones, setOpciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const fetchRef = useRef(fetchFn)

  useEffect(() => {
    let activo = true
    fetchRef.current()
      .then(r => { if (activo) setOpciones(r.data) })
      .catch(() => { if (activo) setOpciones([]) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  const handleChange = (e) => {
    onChange({ target: { name, value: e.target.value } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
        {label}
        {requerido && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        disabled={cargando}
        style={{
          padding: '9px 12px',
          borderRadius: '8px',
          border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
          fontSize: '14px',
          color: value ? '#111827' : '#9ca3af',
          background: '#fafafa',
          cursor: cargando ? 'not-allowed' : 'pointer',
          outline: 'none',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '36px',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = '#0369a1' }}
        onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#d1d5db' }}
      >
        <option value="">
          {cargando ? 'Cargando...' : `— Seleccionar ${label.toLowerCase()} —`}
        </option>
        {opciones.map((item, i) => (
          <option key={i} value={getValue(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>{error}</span>
      )}
    </div>
  )
}
