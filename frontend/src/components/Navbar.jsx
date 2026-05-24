import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, QrCode, LayoutDashboard, History, Menu, X } from 'lucide-react'

const NAV = [
  { to: '/',          label: 'Home',       Icon: Shield },
  { to: '/scan',      label: 'Scan',       Icon: QrCode },
  { to: '/dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { to: '/history',   label: 'History',    Icon: History },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="glass relative" style={{ zIndex: 50, borderBottom: '1px solid #1E2D45' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px',
                    height: '64px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,212,255,0.3)'
          }}>
            <Shield size={18} color="#050B18" />
          </div>
          <span style={{ fontFamily: 'Orbitron', fontSize: '18px', fontWeight: '700',
                         background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                         WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                         letterSpacing: '2px' }}>
            QRShield
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
             className="hidden-mobile">
          {NAV.map(({ to, label, Icon }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              textDecoration: 'none', fontSize: '14px',
              fontFamily: 'Rajdhani', fontWeight: '600',
              transition: 'all 0.2s',
              background: pathname === to ? 'rgba(0,212,255,0.08)' : 'transparent',
              border: pathname === to ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
              color: pathname === to ? '#00D4FF' : '#8A9BB5',
            }}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
                   color: '#8A9BB5', display: 'none' }}
          className="show-mobile">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="glass" style={{
          borderTop: '1px solid #1E2D45', padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
          {NAV.map(({ to, label, Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '10px', textDecoration: 'none',
              fontFamily: 'Rajdhani', fontWeight: '600', fontSize: '15px',
              color: pathname === to ? '#00D4FF' : '#8A9BB5',
              background: pathname === to ? 'rgba(0,212,255,0.08)' : 'transparent',
            }}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}