import { useEffect, useState, useCallback } from 'react'
import { getHistory, deleteScan, clearHistory } from '../api'
import RiskBadge from '../components/RiskBadge'
import {
  Search, Trash2, RefreshCw, Loader2,
  Filter, History as HistoryIcon
} from 'lucide-react'

const RISK_FILTERS = ['all', 'low', 'medium', 'high', 'unknown']

export default function History() {
  const [data, setData]             = useState({ scans: [], total: 0, pages: 1 })
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [riskFilter, setRiskFilter] = useState('all')
  const [search, setSearch]         = useState('')
  const [searchInput, setSearchInput] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    getHistory({
      page, per_page: 15,
      risk:   riskFilter === 'all' ? undefined : riskFilter,
      search: search || undefined,
    }).then(setData).finally(() => setLoading(false))
  }, [page, riskFilter, search])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    await deleteScan(id)
    load()
  }

  const handleClear = async () => {
    if (!window.confirm('Delete ALL scan history?')) return
    await clearHistory()
    load()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const inputStyle = {
    width: '100%', background: '#0D1526', border: '1px solid #1E2D45',
    borderRadius: '10px', padding: '9px 12px 9px 36px',
    color: '#E2EAF4', fontSize: '14px', fontFamily: 'Rajdhani',
    outline: 'none', transition: 'border-color 0.2s'
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                    justifyContent: 'space-between', gap: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HistoryIcon size={26} color="#00D4FF" />
          <div>
            <h1 style={{ fontFamily: 'Orbitron', fontSize: '22px', fontWeight: '700',
                         background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                         WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Scan History
            </h1>
            <p style={{ color: '#8A9BB5', fontSize: '13px', fontFamily: 'Rajdhani', marginTop: '2px' }}>
              {data.total} total records in MySQL
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={load} className="btn-cyber" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '10px',
            color: '#00D4FF', fontFamily: 'Rajdhani', fontSize: '14px'
          }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleClear} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(255,23,68,0.08)', border: '1px solid rgba(255,23,68,0.3)',
            color: '#FF1744', fontFamily: 'Rajdhani', fontSize: '14px',
            transition: 'all 0.2s'
          }}>
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ borderRadius: '16px', padding: '16px',
                                      marginBottom: '20px', display: 'flex',
                                      flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} color="#4A6080" style={{
              position: 'absolute', left: '10px',
              top: '50%', transform: 'translateY(-50%)'
            }} />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search URL or domain..."
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
              onBlur={e => e.target.style.borderColor = '#1E2D45'} />
          </div>
          <button type="submit" className="btn-cyber" style={{
            padding: '8px 16px', borderRadius: '10px',
            color: '#00D4FF', fontFamily: 'Orbitron', fontSize: '12px',
            whiteSpace: 'nowrap'
          }}>Search</button>
        </form>

        {/* Risk filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Filter size={13} color="#4A6080" />
          {RISK_FILTERS.map(f => (
            <button key={f} onClick={() => { setRiskFilter(f); setPage(1) }} style={{
              padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
              fontFamily: 'Orbitron', fontSize: '11px',
              letterSpacing: '1px', textTransform: 'uppercase',
              transition: 'all 0.2s',
              background: riskFilter === f ? 'rgba(0,212,255,0.08)' : 'transparent',
              border: riskFilter === f ? '1px solid rgba(0,212,255,0.4)' : '1px solid #1E2D45',
              color: riskFilter === f ? '#00D4FF' : '#4A6080',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center',
                        alignItems: 'center', padding: '80px' }}>
            <Loader2 size={28} color="#00D4FF"
              style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : data.scans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px',
                        color: '#4A6080', fontFamily: 'Rajdhani' }}>
            <HistoryIcon size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px' }}>No scan history found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E2D45', background: 'rgba(13,21,38,0.5)' }}>
                  {['ID', 'Content', 'Type', 'Risk', 'Score', 'Scanned At', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontFamily: 'Orbitron', fontSize: '11px', fontWeight: '600',
                      color: '#4A6080', letterSpacing: '2px', textTransform: 'uppercase'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.scans.map((scan, i) => (
                  <tr key={scan.id} style={{
                    borderBottom: '1px solid rgba(30,45,69,0.5)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(13,21,38,0.3)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(13,21,38,0.3)'}>

                    <td style={{ padding: '12px 16px', color: '#4A6080',
                                 fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
                      #{scan.id}
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                      <p style={{ color: '#E2EAF4', fontFamily: 'JetBrains Mono',
                                  fontSize: '12px', overflow: 'hidden',
                                  textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {scan.url || scan.raw_content}
                      </p>
                      {scan.domain && (
                        <p style={{ color: '#4A6080', fontSize: '11px',
                                    marginTop: '2px', fontFamily: 'Rajdhani' }}>
                          {scan.domain}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '6px',
                        background: '#111B2E', border: '1px solid #1E2D45',
                        color: '#8A9BB5', fontSize: '11px',
                        fontFamily: 'Orbitron', textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>{scan.content_type}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <RiskBadge level={scan.risk_level} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: 'Orbitron', fontWeight: '700',
                                     color: '#00D4FF', fontSize: '15px' }}>
                        {scan.risk_score}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4A6080',
                                 fontSize: '12px', fontFamily: 'Rajdhani',
                                 whiteSpace: 'nowrap' }}>
                      {new Date(scan.scanned_at).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleDelete(scan.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#4A6080', transition: 'color 0.2s', padding: '4px'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#FF1744'}
                      onMouseLeave={e => e.currentTarget.style.color = '#4A6080'}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center',
                      gap: '8px', marginTop: '24px' }}>
          {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: '36px', height: '36px', borderRadius: '8px',
              cursor: 'pointer', fontFamily: 'Orbitron', fontSize: '13px',
              transition: 'all 0.2s',
              background: p === page ? 'rgba(0,212,255,0.08)' : 'transparent',
              border: p === page ? '1px solid rgba(0,212,255,0.4)' : '1px solid #1E2D45',
              color: p === page ? '#00D4FF' : '#4A6080',
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}