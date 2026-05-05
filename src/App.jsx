import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import GuiaFlujo from './components/GuiaFlujo'
import Dashboard from './pages/Dashboard'
import GestionPage from './pages/GestionPage'
import StockPage from './pages/StockPage'

export default function App() {
  const [pagina, setPagina] = useState('dashboard')
  const [guiaAbierta, setGuiaAbierta] = useState(false)

  const renderPagina = () => {
    if (pagina === 'dashboard') return <Dashboard />
    if (pagina === 'stock')     return <StockPage />
    if (pagina === 'gestion')   return <GestionPage />
    return null
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      background: '#f0f4f8',
    }}>
      <Sidebar paginaActiva={pagina} onNavegar={setPagina} />

      {/* Contenido principal desplazado por el sidebar */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Topbar pagina={pagina} onAbrirGuia={() => setGuiaAbierta(true)} />
        <main style={{ flex: 1, padding: '28px 32px' }}>
          {renderPagina()}
        </main>
      </div>

      {guiaAbierta && <GuiaFlujo onCerrar={() => setGuiaAbierta(false)} />}
    </div>
  )
}
