import { Routes, Route } from 'react-router-dom'
import Navbar    from './components/Navbar'
import Footer    from './components/Footer'
import Home      from './pages/Home'
import Scanner   from './pages/Scanner'
import Dashboard from './pages/Dashboard'
import History   from './pages/History'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#050B18' }}>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />

      <Navbar />

      <main className="flex-1 relative" style={{ zIndex: 10 }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/scan"      element={<Scanner />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history"   element={<History />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}