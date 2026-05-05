import axios from 'axios'

// En Vercel: variable VITE_API_URL = https://tu-servicio.up.railway.app (sin /api al final)
const envUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const baseURL = envUrl ? `${envUrl}/api` : 'http://localhost:5003/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
