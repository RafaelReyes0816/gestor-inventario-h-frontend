/**
 * Mensaje legible desde respuestas del API (incluye 400 validación y { mensaje }).
 */
export function mensajeDesdeAxios(err) {
  const d = err.response?.data
  if (d && typeof d.mensaje === 'string' && d.mensaje.trim()) return d.mensaje
  if (d?.errors && typeof d.errors === 'object') {
    const msgs = Object.values(d.errors)
      .flat()
      .filter((x) => typeof x === 'string' && x.trim())
    if (msgs.length) return msgs.join(' ')
  }
  if (typeof d?.title === 'string' && d.title.trim()) return d.title
  return err.message || 'Error al comunicarse con el servidor'
}

/**
 * Mapea errors del ModelState (ASP.NET) a claves de formulario en camelCase.
 */
export function erroresCamposDesdeAxios(err) {
  const data = err.response?.data
  if (!data?.errors || typeof data.errors !== 'object') return {}
  const out = {}
  for (const [rawKey, val] of Object.entries(data.errors)) {
    const arr = Array.isArray(val) ? val : [val]
    const msg = arr.find((x) => typeof x === 'string' && x.trim())
    if (!msg) continue
    const short = rawKey.includes('.') ? rawKey.split('.').pop() : rawKey
    if (!short) continue
    const camel = short.charAt(0).toLowerCase() + short.slice(1)
    out[camel] = msg
    out[short] = msg
  }
  return out
}
