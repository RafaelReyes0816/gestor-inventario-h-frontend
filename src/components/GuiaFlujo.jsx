const PASOS = [
  {
    numero: 1,
    titulo: 'Registrar Categorías',
    descripcion: 'Antes de agregar insumos, debés definir las categorías que los clasificarán (ej: Medicamentos, Material descartable, Equipos).',
    donde: 'Gestión → Categorías',
    color: '#7c3aed',
  },
  {
    numero: 2,
    titulo: 'Registrar Insumos',
    descripcion: 'Con las categorías ya creadas, registrá cada insumo y asignale su categoría correspondiente.',
    donde: 'Gestión → Insumos',
    color: '#0369a1',
  },
  {
    numero: 3,
    titulo: 'Registrar Almacenes',
    descripcion: 'Creá los almacenes o depósitos físicos donde se guardará el stock de insumos.',
    donde: 'Gestión → Almacenes',
    color: '#059669',
  },
  {
    numero: 4,
    titulo: 'Registrar Proveedores',
    descripcion: 'Agregá los proveedores que suministran los insumos al hospital.',
    donde: 'Gestión → Proveedores',
    color: '#d97706',
  },
  {
    numero: 5,
    titulo: 'Vincular Insumos con Almacenes',
    descripcion: 'Distribuí los insumos a los almacenes donde estarán disponibles. Un insumo puede estar en varios almacenes.',
    donde: 'Gestión → Distribuciones',
    color: '#0891b2',
  },
  {
    numero: 6,
    titulo: 'Vincular Proveedores con Insumos',
    descripcion: 'Indicá qué proveedor suministra qué insumo. Permite rastrear el origen de cada producto.',
    donde: 'Gestión → Suministros',
    color: '#be185d',
  },
  {
    numero: 7,
    titulo: 'Registrar Movimientos de Stock',
    descripcion: 'Con todo lo anterior configurado, ya podés registrar entradas (compras, recepciones) y salidas (uso, distribución) de insumos en los almacenes.',
    donde: 'Stock → Registrar movimiento',
    color: '#b91c1c',
  },
]

export default function GuiaFlujo({ onCerrar }) {
  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '760px',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Encabezado */}
        <div style={{
          padding: '24px 28px 18px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          zIndex: 1,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
              Guia de flujo de trabajo
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Segu&iacute; este orden para configurar y operar el sistema correctamente
            </p>
          </div>
          <button
            onClick={onCerrar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              color: '#94a3b8',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '2px 6px',
            }}
          >
            &times;
          </button>
        </div>

        {/* Tarjetas */}
        <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PASOS.map((paso) => (
            <div
              key={paso.numero}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px 18px',
                borderLeft: `4px solid ${paso.color}`,
              }}
            >
              {/* Número */}
              <div style={{
                minWidth: '36px',
                height: '36px',
                borderRadius: '50%',
                background: paso.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {paso.numero}
              </div>

              {/* Contenido */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    {paso.titulo}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: paso.color + '18',
                    color: paso.color,
                    border: `1px solid ${paso.color}40`,
                    whiteSpace: 'nowrap',
                  }}>
                    {paso.donde}
                  </span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                  {paso.descripcion}
                </p>
              </div>
            </div>
          ))}

          {/* Nota al pie */}
          <div style={{
            marginTop: '4px',
            padding: '12px 16px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#0369a1',
          }}>
            <strong>Nota:</strong> Los pasos 1 al 4 son la configuraci&oacute;n inicial. Una vez hecha, en el d&iacute;a a d&iacute;a solo usar&aacute;s el paso 7 para registrar movimientos de stock.
          </div>
        </div>
      </div>
    </div>
  )
}
