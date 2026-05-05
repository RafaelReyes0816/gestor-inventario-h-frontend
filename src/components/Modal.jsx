import { useEffect, useRef } from 'react'

export default function Modal({ titulo, onCerrar, onGuardar, cargando, children }) {
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCerrar() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCerrar])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar() }}
    >
      <div ref={ref} style={{
        background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>{titulo}</h3>
          <button onClick={onCerrar} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '20px', color: '#9ca3af', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid #e5e7eb',
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
        }}>
          <button onClick={onCerrar} style={{
            padding: '8px 20px', borderRadius: '8px', border: '1px solid #d1d5db',
            background: '#fff', color: '#374151', fontWeight: 600,
            cursor: 'pointer', fontSize: '14px',
          }}>
            Cancelar
          </button>
          <button onClick={onGuardar} disabled={cargando} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none',
            background: cargando ? '#7dd3fc' : '#0369a1', color: '#fff',
            fontWeight: 600, cursor: cargando ? 'not-allowed' : 'pointer', fontSize: '14px',
            boxShadow: cargando ? 'none' : '0 2px 6px rgba(3,105,161,0.30)',
          }}>
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
