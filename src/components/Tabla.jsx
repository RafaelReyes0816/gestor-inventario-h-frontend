export default function Tabla({ columnas, datos, vacio = 'Sin datos disponibles' }) {
  if (!datos || datos.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
        {vacio}
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            {columnas.map((col) => (
              <th key={col.key} style={{
                padding: '10px 16px',
                textAlign: 'left',
                color: '#374151',
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb',
                whiteSpace: 'nowrap',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columnas.map((col) => (
                <td key={col.key} style={{ padding: '10px 16px', color: '#374151' }}>
                  {col.render ? col.render(fila[col.key], fila) : (fila[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
