export default function StatsCard({ label, value, icon: Icon, color = 'cyan', sublabel }) {
  const colorMap = {
    cyan:   { text: '#00D4FF', bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.2)'   },
    safe:   { text: '#00E676', bg: 'rgba(0,230,118,0.1)',   border: 'rgba(0,230,118,0.2)'   },
    warn:   { text: '#FFD600', bg: 'rgba(255,214,0,0.1)',   border: 'rgba(255,214,0,0.2)'   },
    danger: { text: '#FF1744', bg: 'rgba(255,23,68,0.1)',   border: 'rgba(255,23,68,0.2)'   },
    muted:  { text: '#4A6080', bg: 'rgba(74,96,128,0.1)',   border: 'rgba(74,96,128,0.2)'   },
  }
  const c = colorMap[color]

  return (
    <div className="glass glass-hover" style={{
      borderRadius: '16px', padding: '20px',
      display: 'flex', alignItems: 'center', gap: '16px',
      transition: 'all 0.3s'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: c.bg, border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={22} color={c.text} />
      </div>
      <div>
        <div style={{ fontSize: '28px', fontFamily: 'Orbitron', fontWeight: '700', color: c.text }}>
          {value}
        </div>
        <div style={{ fontSize: '13px', fontFamily: 'Rajdhani', color: '#8A9BB5', marginTop: '2px' }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '11px', color: '#4A6080', marginTop: '2px' }}>{sublabel}</div>
        )}
      </div>
    </div>
  )
}