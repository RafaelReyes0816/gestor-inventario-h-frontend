import axios from 'axios'

const base = import.meta.env.VITE_API_URL || 'http://localhost:5003'

const api = axios.create({
  baseURL: `${base.replace(/\/$/, '')}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
