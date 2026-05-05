const META = {
  dashboard: { titulo: 'Dashboard', subtitulo: 'Estadísticas e información gerencial del inventario' },
  stock:     { titulo: 'Stock',     subtitulo: 'Registro de entradas y salidas de insumos' },
  gestion:   { titulo: 'Gestión',   subtitulo: 'Administración de registros y entidades del sistema' },
}

export default function Topbar({ pagina, onAbrirGuia }) {
  const { titulo, subtitulo } = META[pagina] ?? { titulo: pagina, subtitulo: '' }

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
            Inventario Hospital
          </span>
          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>/</span>
          <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 600 }}>
            {titulo}
          </span>
        </div>
        <h1 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
          {subtitulo}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onAbrirGuia}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: '#f0fdf4',
            border: '1px solid #86efac',
            fontSize: '12px',
            color: '#15803d',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Flujo de trabajo
        </button>

        <div style={{
          padding: '6px 14px',
          borderRadius: '20px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          fontSize: '12px',
          color: '#0369a1',
          fontWeight: 600,
        }}>
          Módulo de Inventario
        </div>
      </div>
    </header>
  )
}
