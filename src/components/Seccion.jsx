export default function Seccion({ titulo, descripcion, children, alerta = false }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      borderLeft: `4px solid ${alerta ? '#dc2626' : '#0369a1'}`,
    }}>
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        {alerta && (
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#dc2626', marginTop: '6px', flexShrink: 0,
            boxShadow: '0 0 6px rgba(220,38,38,0.5)',
          }} />
        )}
        <div>
          <h2 style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 700,
            color: '#0f172a',
          }}>
            {titulo}
          </h2>
          {descripcion && (
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
              {descripcion}
            </p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
