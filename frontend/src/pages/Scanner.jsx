import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { scanQR } from '../api'
import ScanResult from '../components/ScanResult'
import { QrCode, Loader2, AlertCircle } from 'lucide-react'

export default function Scanner() {
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [scanning, setScanning] = useState(true)
  const scannerRef              = useRef(null)

  useEffect(() => {
    if (!scanning) return

    // Clear leftover DOM first
    const el = document.getElementById('qr-reader')
    if (el) el.innerHTML = ''

    let scanner = null

    const timer = setTimeout(() => {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          rememberLastUsedCamera: true,
          aspectRatio: 1.0,
        },
        false
      )

      scanner.render(
        async (decodedText) => {
          try { await scanner.clear() } catch (_) {}
          setScanning(false)
          setLoading(true)
          setError(null)
          try {
            const data = await scanQR(decodedText)
            setResult(data.analysis)
          } catch (err) {
            setError('Failed to analyze. Is the Flask backend running on port 5000?')
          } finally {
            setLoading(false)
          }
        },
        () => {}
      )

      scannerRef.current = scanner
    }, 100)

    return () => {
      clearTimeout(timer)
      if (scannerRef.current) {
        try { scannerRef.current.clear() } catch (_) {}
        scannerRef.current = null
      }
      const el = document.getElementById('qr-reader')
      if (el) el.innerHTML = ''
    }
  }, [scanning])

  const handleScanAgain = () => {
    setResult(null)
    setError(null)
    setScanning(true)
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px',
                    animation: 'fade-up 0.5s ease-out forwards' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 16px',
          background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <QrCode size={32} color="#00D4FF" />
        </div>
        <h1 style={{ fontFamily: 'Orbitron', fontSize: '28px', fontWeight: '700',
                     background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                     WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                     marginBottom: '8px' }}>QR Scanner</h1>
        <p style={{ color: '#8A9BB5', fontFamily: 'Rajdhani', fontSize: '16px' }}>
          Point your camera at a QR code. Risk is analyzed before anything opens.
        </p>
      </div>

      {/* Scanner Box */}
      {scanning && (
        <div className="glass" style={{ borderRadius: '20px', padding: '24px',
                                        animation: 'fade-up 0.5s ease-out forwards' }}>
          <div style={{ position: 'relative' }}>
            {/* Corner decorations */}
            {[
              { top: 0, left: 0, borderTop: '3px solid #00D4FF', borderLeft: '3px solid #00D4FF', borderRadius: '8px 0 0 0' },
              { top: 0, right: 0, borderTop: '3px solid #00D4FF', borderRight: '3px solid #00D4FF', borderRadius: '0 8px 0 0' },
              { bottom: 0, left: 0, borderBottom: '3px solid #00D4FF', borderLeft: '3px solid #00D4FF', borderRadius: '0 0 0 8px' },
              { bottom: 0, right: 0, borderBottom: '3px solid #00D4FF', borderRight: '3px solid #00D4FF', borderRadius: '0 0 8px 0' },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute', width: '28px', height: '28px', zIndex: 10, ...s
              }} />
            ))}
            <div id="qr-reader" style={{ width: '100%' }} />
          </div>
          <p style={{ textAlign: 'center', color: '#4A6080', fontSize: '12px',
                      marginTop: '16px', fontFamily: 'Rajdhani' }}>
            🛡️ Camera feed stays on your device — nothing is uploaded
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="glass" style={{
          borderRadius: '20px', padding: '60px 24px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '16px'
        }}>
          <Loader2 size={40} color="#00D4FF"
            style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#8A9BB5', fontFamily: 'Rajdhani', fontSize: '16px' }}>
            Analyzing destination...
          </p>
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass" style={{
          borderRadius: '20px', padding: '24px',
          border: '1px solid rgba(255,23,68,0.3)',
          display: 'flex', gap: '12px', alignItems: 'flex-start'
        }}>
          <AlertCircle size={20} color="#FF1744"
            style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: '#FF1744', fontFamily: 'Rajdhani',
                        fontWeight: '600', fontSize: '16px' }}>Analysis Failed</p>
            <p style={{ color: '#8A9BB5', fontSize: '14px',
                        marginTop: '4px', fontFamily: 'Rajdhani' }}>{error}</p>
            <button onClick={handleScanAgain} style={{
              marginTop: '12px', background: 'none', border: 'none',
              color: '#00D4FF', cursor: 'pointer',
              fontSize: '13px', fontFamily: 'Rajdhani'
            }}>Try Again →</button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <ScanResult analysis={result} onScanAgain={handleScanAgain} />
      )}

    </div>
  )
}