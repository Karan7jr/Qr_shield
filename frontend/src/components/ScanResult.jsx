import { useState } from 'react'
import { ExternalLink, Copy, CheckCheck, Link2, Globe, Zap, AlertTriangle } from 'lucide-react'
import RiskBadge from './RiskBadge'

export default function ScanResult({ analysis, onScanAgain }) {
  const [copied, setCopied]     = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(analysis.raw_content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpen = () => {
    if (analysis.risk_level === 'high' && !confirmed) {
      setConfirmed(true)
      return
    }
    window.open(analysis.url, '_blank', 'noopener,noreferrer')
    setConfirmed(false)
  }

  const glowColor = {
    low: 'rgba(0,230,118,0.15)', medium: 'rgba(255,214,0,0.15)',
    high: 'rgba(255,23,68,0.15)', unknown: 'rgba(74,96,128,0.15)'
  }

  return (
    <div className="glass" style={{
      borderRadius: '20px', padding: '28px',
      boxShadow: `0 8px 40px ${glowColor[analysis.risk_level]}`,
      animation: 'fade-up 0.5s ease-out forwards'
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <p style={{ color: '#8A9BB5', fontSize: '12px', fontFamily: 'Orbitron',
                      letterSpacing: '2px', marginBottom: '8px' }}>ANALYSIS RESULT</p>
          <RiskBadge level={analysis.risk_level} size="lg" />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#8A9BB5', fontSize: '11px', fontFamily: 'Rajdhani' }}>Risk Score</div>
          <div style={{ fontSize: '36px', fontFamily: 'Orbitron', fontWeight: '700', color: '#00D4FF' }}>
            {analysis.risk_score ?? 0}
          </div>
          <div style={{ color: '#8A9BB5', fontSize: '11px' }}>/ 100</div>
        </div>
      </div>

      {/* URL Info */}
      {analysis.url && (
        <div style={{ borderRadius: '12px', background: 'rgba(13,21,38,0.5)',
                      border: '1px solid #1E2D45', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Link2 size={13} color="#00D4FF" />
            <span style={{ color: '#8A9BB5', fontSize: '11px', fontFamily: 'Orbitron',
                           letterSpacing: '2px', textTransform: 'uppercase' }}>Destination</span>
          </div>
          <p style={{ color: '#00D4FF', fontFamily: 'JetBrains Mono', fontSize: '13px',
                      wordBreak: 'break-all', lineHeight: '1.6' }}>{analysis.url}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            <span style={{
              fontSize: '12px', padding: '3px 10px', borderRadius: '999px',
              background: analysis.is_https ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)',
              border: `1px solid ${analysis.is_https ? 'rgba(0,230,118,0.3)' : 'rgba(255,23,68,0.3)'}`,
              color: analysis.is_https ? '#00E676' : '#FF1744',
              fontFamily: 'Orbitron'
            }}>
              {analysis.is_https ? '🔒 HTTPS' : '⚠️ HTTP'}
            </span>
            {analysis.domain && (
              <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '999px',
                             background: '#111B2E', border: '1px solid #1E2D45',
                             color: '#8A9BB5', display: 'flex', alignItems: 'center', gap: '4px',
                             fontFamily: 'Rajdhani' }}>
                <Globe size={10} /> {analysis.domain}
              </span>
            )}
            {analysis.is_shortener && (
              <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '999px',
                             background: 'rgba(255,214,0,0.1)', border: '1px solid rgba(255,214,0,0.3)',
                             color: '#FFD600', fontFamily: 'Orbitron' }}>
                🔀 Shortener
              </span>
            )}
          </div>
        </div>
      )}

      {/* Non-URL content */}
      {analysis.content_type !== 'url' && (
        <div style={{ borderRadius: '12px', background: 'rgba(13,21,38,0.5)',
                      border: '1px solid #1E2D45', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={13} color="#00D4FF" />
            <span style={{ color: '#8A9BB5', fontSize: '11px', fontFamily: 'Orbitron',
                           letterSpacing: '2px' }}>
              CONTENT ({analysis.content_type?.toUpperCase()})
            </span>
          </div>
          <p style={{ color: '#E2EAF4', fontFamily: 'JetBrains Mono', fontSize: '13px',
                      wordBreak: 'break-all' }}>{analysis.raw_content}</p>
        </div>
      )}

      {/* Risk Reasons */}
      {analysis.risk_reasons?.length > 0 && (
        <div style={{ borderRadius: '12px', background: 'rgba(255,23,68,0.05)',
                      border: '1px solid rgba(255,23,68,0.2)', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertTriangle size={13} color="#FF1744" />
            <span style={{ color: '#FF1744', fontSize: '11px', fontFamily: 'Orbitron',
                           letterSpacing: '2px', textTransform: 'uppercase' }}>Risk Signals</span>
          </div>
          {analysis.risk_reasons.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '6px',
                                  fontSize: '14px', fontFamily: 'Rajdhani', color: '#E2EAF4' }}>
              <span style={{ color: '#FF1744' }}>›</span> {r}
            </div>
          ))}
        </div>
      )}

      {/* High risk confirmation */}
      {confirmed && (
        <div style={{ borderRadius: '12px', background: 'rgba(255,23,68,0.08)',
                      border: '1px solid rgba(255,23,68,0.4)', padding: '16px',
                      marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ color: '#FF1744', fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: '600' }}>
            ⚠️ Are you sure?
          </p>
          <p style={{ color: '#8A9BB5', fontSize: '13px', margin: '6px 0 14px' }}>
            This link is flagged HIGH RISK. Proceed only if you trust the source.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setConfirmed(false)} style={{
              padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
              background: '#111B2E', border: '1px solid #1E2D45',
              color: '#8A9BB5', fontFamily: 'Rajdhani', fontSize: '13px'
            }}>Cancel</button>
            <button onClick={handleOpen} style={{
              padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
              background: 'rgba(255,23,68,0.15)', border: '1px solid rgba(255,23,68,0.4)',
              color: '#FF1744', fontFamily: 'Rajdhani', fontSize: '13px'
            }}>Open Anyway</button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {analysis.url && !confirmed && (
          <button onClick={handleOpen} className="btn-cyber" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '12px',
            color: '#00D4FF', fontFamily: 'Rajdhani',
            fontSize: '15px', fontWeight: '600'
          }}>
            <ExternalLink size={15} /> Open Link
          </button>
        )}
        <button onClick={handleCopy} className="btn-cyber" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '12px',
          color: '#00D4FF', fontFamily: 'Rajdhani',
          fontSize: '15px', fontWeight: '600'
        }}>
          {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={onScanAgain} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
          background: '#111B2E', border: '1px solid #1E2D45',
          color: '#8A9BB5', fontFamily: 'Rajdhani', fontSize: '15px'
        }}>
          Scan Another
        </button>
      </div>
    </div>
  )
}