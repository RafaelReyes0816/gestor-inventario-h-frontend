export default function Campo({ label, name, value, onChange, placeholder = '', requerido = false, type = 'text', error }) {
  const tieneError = Boolean(error)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
        {label}{requerido && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: '9px 12px', borderRadius: '8px',
          border: tieneError ? '1px solid #ef4444' : '1px solid #d1d5db', fontSize: '14px',
          outline: 'none', color: '#111827',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = '#2563eb' }}
        onBlur={e => { e.target.style.borderColor = tieneError ? '#ef4444' : '#d1d5db' }}
      />
      {tieneError && (
        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>{error}</span>
      )}
    </div>
  )
}
