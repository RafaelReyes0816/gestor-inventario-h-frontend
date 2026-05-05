const ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    desc: 'Estadísticas MIS',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    key: 'stock',
    label: 'Stock',
    desc: 'Entradas y salidas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    key: 'gestion',
    label: 'Gestión',
    desc: 'Tablas y registros',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
]

export default function Sidebar({ paginaActiva, onNavegar }) {
  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#0a2540',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
      boxShadow: '2px 0 12px rgba(0,0,0,0.18)',
    }}>

      {/* Logo / título */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#0369a1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
              Gestión de
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', lineHeight: 1.2 }}>
              Inventarios
            </div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', letterSpacing: '0.04em' }}>
          MÓDULO HOSPITALARIO
        </div>
      </div>

      {/* Navegación */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700, letterSpacing: '0.1em', padding: '0 12px', marginBottom: '8px' }}>
          NAVEGACIÓN
        </div>
        {ITEMS.map(item => {
          const activo = paginaActiva === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavegar(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                background: activo ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                color: activo ? '#38bdf8' : '#94a3b8',
                borderLeft: activo ? '3px solid #38bdf8' : '3px solid transparent',
              }}
              onMouseEnter={e => {
                if (!activo) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={e => {
                if (!activo) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ flexShrink: 0, opacity: activo ? 1 : 0.7 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: activo ? 700 : 500, lineHeight: 1.2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.6, lineHeight: 1.3, marginTop: '1px' }}>
                  {item.desc}
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer con indicador */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e',
          }} />
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Sistema activo
          </span>
        </div>
        <div style={{ fontSize: '11px', color: '#334155', marginTop: '6px' }}>
          Puerto 5003
        </div>
      </div>
    </aside>
  )
}
