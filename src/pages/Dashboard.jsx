import {
  Briefcase, Store, DollarSign, Star, Clock,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import './Dashboard.css'

const EARNINGS_DATA = [
  { month: 'Jan', earnings: 8000  },
  { month: 'Feb', earnings: 12000 },
  { month: 'Mar', earnings: 9500  },
  { month: 'Apr', earnings: 14000 },
  { month: 'May', earnings: 11200 },
  { month: 'Jun', earnings: 17800 },
]

const GIGS_DATA = [
  { month: 'Jan', gigs: 12 },
  { month: 'Feb', gigs: 19 },
  { month: 'Mar', gigs: 14 },
  { month: 'Apr', gigs: 22 },
  { month: 'May', gigs: 18 },
  { month: 'Jun', gigs: 27 },
]

const RECENT_ACTIVITY = [
  { label: 'Math Tutoring gig completed',    time: '2h ago',  status: 'success', icon: '✅' },
  { label: 'New review received (4.9 ★)',     time: '5h ago',  status: 'success', icon: '⭐' },
  { label: 'Essay Writing gig accepted',      time: '1d ago',  status: 'info',    icon: '📝' },
  { label: 'Wallet Top Up — Ksh 5,000',       time: '2d ago',  status: 'success', icon: '💰' },
  { label: 'Profile verification pending',    time: '3d ago',  status: 'warning', icon: '⚠️' },
]

const TOP_SERVICES = [
  { name: 'Printing',  pct: 35, color: '#10b981', count: 820 },
  { name: 'Laundry',   pct: 25, color: '#3b82f6', count: 586 },
  { name: 'Notes',     pct: 20, color: '#f59e0b', count: 469 },
  { name: 'Housing',   pct: 20, color: '#8b5cf6', count: 469 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-val" style={{ color: '#10b981' }}>
        {payload[0].name === 'earnings'
          ? `Ksh ${payload[0].value.toLocaleString()}`
          : `${payload[0].value} gigs`}
      </p>
    </div>
  )
}

export default function Dashboard() {
  return (
    <main className="page-with-sidebar">
      <div className="main-content">
        <div className="content-wrapper">
          <div className="page-header fade-up">
            <div>
              <h1 className="section-title">Dashboard</h1>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Overview of your campus activity and earnings
              </p>
            </div>
            <Badge variant="success" size="md">● Live</Badge>
          </div>

          {/* Stats row */}
          <div className="grid-4 fade-up fade-up-delay-1">
            <StatCard icon={Briefcase}   label="Total Gigs"      value="2,340"       trend={12}  color="primary" />
            <StatCard icon={Store}       label="Total Services"  value="1,256"       trend={8}   color="accent" />
            <StatCard icon={DollarSign}  label="Total Earnings"  value="KSh 1.24M"   trend={22}  color="success" />
            <StatCard icon={Star}        label="Avg. Rating"     value="4.9 ★"       trend={3}   color="warning" />
          </div>

          {/* Charts */}
          <div className="dashboard-grid fade-up fade-up-delay-2">
            <Card hover={false} className="chart-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="subsection-title">Earnings Overview</h3>
                <Badge variant="primary" size="sm">6 months</Badge>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={EARNINGS_DATA}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2e47" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2.5} fill="url(#earningsGrad)" dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card hover={false} className="chart-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="subsection-title">Gigs Completed</h3>
                <Badge variant="accent" size="sm">6 months</Badge>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={GIGS_DATA} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2e47" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="gigs" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="dashboard-bottom fade-up fade-up-delay-3">
            {/* Recent activity */}
            <Card hover={false}>
              <h3 className="subsection-title mb-4">Recent Activity</h3>
              <div className="activity-list">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="activity-row">
                    <span className="activity-icon">{item.icon}</span>
                    <div className="activity-details">
                      <p className="activity-label">{item.label}</p>
                      <p className="activity-time"><Clock size={11} /> {item.time}</p>
                    </div>
                    <span className={`activity-badge activity-badge--${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top services */}
            <Card hover={false}>
              <h3 className="subsection-title mb-4">Top Services</h3>
              <div className="top-services-list">
                {TOP_SERVICES.map(svc => (
                  <div key={svc.name} className="top-service-row">
                    <div className="top-service-info">
                      <span className="top-service-dot" style={{ background: svc.color }} />
                      <span className="top-service-name">{svc.name}</span>
                    </div>
                    <div className="top-service-bar-wrap">
                      <div
                        className="top-service-bar"
                        style={{ width: `${svc.pct}%`, background: svc.color }}
                      />
                    </div>
                    <span className="top-service-count">{svc.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
