export default function StatCard({ titulo, valor, subtitulo, color = '#0369a1', icono }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
      borderTop: `3px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      transition: 'box-shadow 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)'}
    >
      <span style={{
        fontSize: '12px',
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {titulo}
      </span>
      <span style={{
        fontSize: '36px',
        fontWeight: 800,
        color: '#0f172a',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {valor}
      </span>
      {subtitulo && (
        <span style={{
          fontSize: '12px',
          color: '#94a3b8',
          marginTop: '2px',
        }}>
          {subtitulo}
        </span>
      )}
    </div>
  )
}
