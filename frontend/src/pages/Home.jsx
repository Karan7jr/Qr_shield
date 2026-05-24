import { Link } from 'react-router-dom'
import { Shield, QrCode, BarChart2, History, ArrowRight, CheckCircle } from 'lucide-react'

const FEATURES = [
  { icon: Shield,    title: 'Risk Analysis',      desc: 'Real-time URL safety scoring with keyword and HTTPS detection.' },
  { icon: QrCode,    title: 'Camera & Upload',    desc: 'Scan live via webcam or upload any QR code image instantly.' },
  { icon: BarChart2, title: 'Analytics Dashboard',desc: 'Visual stats on all your past scans and threat patterns.' },
  { icon: History,   title: 'Scan History',       desc: 'Every scan saved to MySQL — searchable and filterable.' },
]

const TRUST = [
  'No auto-opening links',
  'No data sent to third parties',
  '100% client-side analysis',
  'MySQL history for audit trail',
]

export default function Home() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '80px',
                    animation: 'fade-up 0.6s ease-out forwards' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 20px', borderRadius: '999px', marginBottom: '32px',
          background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
          color: '#00D4FF', fontSize: '12px', fontFamily: 'Orbitron', letterSpacing: '2px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%',
                         background: '#00D4FF', animation: 'glow 2s infinite' }} />
          AWARENESS BEFORE ACTION
        </div>

        {/* Heading */}
        <h1 style={{ fontFamily: 'Orbitron', fontWeight: '900', lineHeight: '1.1',
                     marginBottom: '24px' }}>
          <span style={{ fontSize: 'clamp(40px, 7vw, 80px)', color: '#E2EAF4' }}>QR</span>
          <span style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}> Shield</span>
          <br />
          <span style={{ fontSize: 'clamp(20px, 3.5vw, 40px)', color: '#8A9BB5',
                         fontWeight: '400' }}>
            Think Before You Scan
          </span>
        </h1>

        {/* Subtext */}
        <p style={{ color: '#8A9BB5', fontSize: 'clamp(15px, 2vw, 19px)',
                    maxWidth: '620px', margin: '0 auto 40px', fontFamily: 'Rajdhani',
                    lineHeight: '1.7' }}>
          Scan any QR code safely. We analyze the destination, detect phishing
          signals, and show you the risk —{' '}
          <em style={{ color: '#00D4FF', fontStyle: 'normal', fontWeight: '600' }}>
            before
          </em>{' '}
          anything opens.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/scan" className="btn-cyber" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 36px', borderRadius: '14px', textDecoration: 'none',
            fontFamily: 'Orbitron', fontWeight: '600', color: '#00D4FF',
            fontSize: '15px', letterSpacing: '1px'
          }}>
            <QrCode size={20} />
            Start Scanning
            <ArrowRight size={16} />
          </Link>

          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 36px', borderRadius: '14px', textDecoration: 'none',
            fontFamily: 'Orbitron', fontWeight: '600',
            background: '#111B2E', border: '1px solid #1E2D45',
            color: '#8A9BB5', fontSize: '15px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#E2EAF4'; e.currentTarget.style.borderColor = '#4A6080' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8A9BB5'; e.currentTarget.style.borderColor = '#1E2D45' }}>
            <BarChart2 size={20} /> View Dashboard
          </Link>
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                    gap: '12px', marginBottom: '80px' }}>
        {TRUST.map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 18px', borderRadius: '999px',
            background: '#111B2E', border: '1px solid #1E2D45',
            color: '#8A9BB5', fontSize: '13px', fontFamily: 'Rajdhani'
          }}>
            <CheckCircle size={14} color="#00E676" />
            {t}
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px', marginBottom: '80px' }}>
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="glass glass-hover" style={{
            borderRadius: '20px', padding: '28px',
            transition: 'all 0.3s', cursor: 'default'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Icon size={22} color="#00D4FF" />
            </div>
            <h3 style={{ fontFamily: 'Orbitron', fontWeight: '700', color: '#E2EAF4',
                         fontSize: '14px', marginBottom: '10px', letterSpacing: '0.5px' }}>
              {title}
            </h3>
            <p style={{ color: '#8A9BB5', fontSize: '14px', fontFamily: 'Rajdhani',
                        lineHeight: '1.6' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="glass" style={{ borderRadius: '24px', padding: '48px' }}>
        <h2 style={{ fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '700',
                     textAlign: 'center', marginBottom: '40px', letterSpacing: '3px',
                     background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                     WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          HOW IT WORKS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                      gap: '16px', alignItems: 'center' }}>
          {[
            { n: '01', label: 'Scan QR Code',    sub: 'Camera or file upload' },
            { n: '02', label: 'Decode Content',  sub: 'Extract URL or data' },
            { n: '03', label: 'Analyze Risk',    sub: 'Check safety signals' },
            { n: '04', label: 'You Decide',      sub: '🟢 🟡 🔴 Safe choice' },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{
                fontFamily: 'Orbitron', fontSize: '36px', fontWeight: '900',
                background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>{step.n}</div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: '600',
                            color: '#E2EAF4', fontSize: '12px', marginBottom: '6px',
                            letterSpacing: '0.5px' }}>{step.label}</div>
              <div style={{ color: '#4A6080', fontSize: '13px',
                            fontFamily: 'Rajdhani' }}>{step.sub}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
