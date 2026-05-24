import { ShieldCheck, AlertCircle, ShieldOff, HelpCircle } from 'lucide-react'

const CONFIG = {
  low:     { label: 'LOW RISK',    color: '#00E676', bg: 'rgba(0,230,118,0.1)',   border: 'rgba(0,230,118,0.3)',   Icon: ShieldCheck },
  medium:  { label: 'MEDIUM RISK', color: '#FFD600', bg: 'rgba(255,214,0,0.1)',   border: 'rgba(255,214,0,0.3)',   Icon: AlertCircle },
  high:    { label: 'HIGH RISK',   color: '#FF1744', bg: 'rgba(255,23,68,0.1)',   border: 'rgba(255,23,68,0.3)',   Icon: ShieldOff },
  unknown: { label: 'UNKNOWN',     color: '#4A6080', bg: 'rgba(74,96,128,0.1)',   border: 'rgba(74,96,128,0.3)',   Icon: HelpCircle },
}

export default function RiskBadge({ level = 'unknown', size = 'md' }) {
  const { label, color, bg, border, Icon } = CONFIG[level] ?? CONFIG.unknown
  const isLg = size === 'lg'

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      gap: isLg ? '10px' : '6px',
      padding: isLg ? '10px 20px' : '4px 12px',
      borderRadius: '999px',
      border: `1px solid ${border}`,
      background: bg, color,
      fontFamily: 'Orbitron',
      fontSize: isLg ? '14px' : '11px',
      fontWeight: '600',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    }}>
      <Icon size={isLg ? 18 : 13} />
      {label}
    </div>
  )
}