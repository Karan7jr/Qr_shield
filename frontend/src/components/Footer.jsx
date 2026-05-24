import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="glass" style={{
      borderTop: '1px solid #1E2D45', position: 'relative', zIndex: 10
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '24px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px',
        color: '#8A9BB5', fontSize: '14px', fontFamily: 'Rajdhani'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="#00D4FF" />
          <span>QR Shield — <span style={{ color: '#00D4FF' }}>Think Before You Scan</span></span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['/', 'Home'], ['/scan', 'Scan'], ['/dashboard', 'Dashboard'], ['/history', 'History']].map(([to, label]) => (
            <Link key={to} to={to} style={{
              color: '#8A9BB5', textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.target.style.color = '#00D4FF'}
            onMouseLeave={e => e.target.style.color = '#8A9BB5'}>
              {label}
            </Link>
          ))}
        </div>
        <span>© 2026 QR Shield · Privacy-First</span>
      </div>
    </footer>
  )
}