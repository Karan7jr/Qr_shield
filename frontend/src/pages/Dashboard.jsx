import { useEffect, useState } from 'react'
import { getStats } from '../api'
import StatsCard from '../components/StatsCard'
import {
  BarChart2, Shield, ShieldCheck, AlertCircle,
  ShieldOff, HelpCircle, Loader2, TrendingUp
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts'

const PIE_COLORS = ['#00E676', '#FFD600', '#FF1744', '#4A6080']

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center',
                  alignItems: 'center', height: '400px' }}>
      <Loader2 size={36} color="#00D4FF"
        style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '80px 24px',
                  color: '#8A9BB5', fontFamily: 'Rajdhani' }}>
      Could not load stats. Make sure Flask backend is running.
    </div>
  )

  const pieData = [
    { name: 'Low',     value: stats.low     || 0 },
    { name: 'Medium',  value: stats.medium  || 0 },
    { name: 'High',    value: stats.high    || 0 },
    { name: 'Unknown', value: stats.unknown || 0 },
  ]

  const tooltipStyle = {
    background: '#111B2E', border: '1px solid #1E2D45',
    borderRadius: '10px', color: '#E2EAF4',
    fontFamily: 'Rajdhani', fontSize: '13px'
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <BarChart2 size={28} color="#00D4FF" />
        <div>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '22px', fontWeight: '700',
                       background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                       WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Analytics Dashboard
          </h1>
          <p style={{ color: '#8A9BB5', fontSize: '13px', fontFamily: 'Rajdhani', marginTop: '2px' }}>
            All-time scan statistics from MySQL
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px', marginBottom: '32px' }}>
        <StatsCard label="Total Scans"  value={stats.total}   icon={Shield}     color="cyan" />
        <StatsCard label="Low Risk"     value={stats.low}     icon={ShieldCheck} color="safe" />
        <StatsCard label="Medium Risk"  value={stats.medium}  icon={AlertCircle} color="warn" />
        <StatsCard label="High Risk"    value={stats.high}    icon={ShieldOff}   color="danger" />
        <StatsCard label="Unknown"      value={stats.unknown} icon={HelpCircle}  color="muted"
          sublabel={`${stats.safe_percent}% safe`} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px', marginBottom: '24px' }}>

        {/* Bar Chart */}
        <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <TrendingUp size={15} color="#00D4FF" />
            <span style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: '600',
                           color: '#E2EAF4', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Scans — Last 7 Days
            </span>
          </div>
          {stats.daily_scans?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.daily_scans}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fill: '#8A9BB5', fontSize: 11, fontFamily: 'Rajdhani' }}
                  tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8A9BB5', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#00D4FF' }}
                  cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                <Bar dataKey="count" fill="#00D4FF" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#4A6080', fontFamily: 'Rajdhani' }}>
              No data for last 7 days
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Shield size={15} color="#00D4FF" />
            <span style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: '600',
                           color: '#E2EAF4', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Risk Distribution
            </span>
          </div>
          {stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Legend formatter={v => (
                  <span style={{ color: '#8A9BB5', fontSize: '12px', fontFamily: 'Rajdhani' }}>{v}</span>
                )} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#4A6080', fontFamily: 'Rajdhani' }}>
              No scans yet
            </div>
          )}
        </div>
      </div>

      {/* Top Domains */}
      {stats.top_domains?.length > 0 && (
        <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
          <span style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: '600',
                         color: '#E2EAF4', letterSpacing: '2px', textTransform: 'uppercase',
                         display: 'block', marginBottom: '20px' }}>
            Top Scanned Domains
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.top_domains.map((d, i) => {
              const pct = stats.total > 0 ? (d.count / stats.total * 100) : 0
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: 'Orbitron', color: '#4A6080',
                                 fontSize: '12px', width: '20px' }}>{i + 1}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', color: '#00D4FF',
                                 fontSize: '13px', flex: 1 }}>{d.domain}</span>
                  <div style={{ width: '120px', height: '6px', background: '#1E2D45',
                                borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px', width: `${pct}%`,
                      background: 'linear-gradient(90deg, #00D4FF, #0066FF)'
                    }} />
                  </div>
                  <span style={{ color: '#8A9BB5', fontSize: '12px',
                                 width: '24px', textAlign: 'right',
                                 fontFamily: 'Rajdhani' }}>{d.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}