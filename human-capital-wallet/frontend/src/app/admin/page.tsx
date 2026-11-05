'use client'
import { Users, Briefcase, DollarSign, TrendingUp, AlertTriangle, Clock } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'

const STATS = [
  { icon: Users,      label: 'Total Users',         value: '52,340',      trend: '+1,240 this week', color: 'text-primary',     bg: 'bg-primary/10' },
  { icon: Briefcase,  label: 'Opportunities',        value: '10,890',      trend: '+320 this week',   color: 'text-accent',      bg: 'bg-accent/10'  },
  { icon: DollarSign, label: 'Revenue (Month)',      value: 'KSh 4.8M',    trend: '+18% MoM',         color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
  { icon: TrendingUp, label: 'Active Subscriptions', value: '8,420',       trend: '+560 this month',  color: 'text-green-400',   bg: 'bg-green-400/10' },
]

const GROWTH_DATA = [
  { month: 'Jan', users: 38000, revenue: 3200000 },
  { month: 'Feb', users: 41000, revenue: 3600000 },
  { month: 'Mar', users: 44000, revenue: 3900000 },
  { month: 'Apr', users: 47000, revenue: 4200000 },
  { month: 'May', users: 50000, revenue: 4600000 },
  { month: 'Jun', users: 52340, revenue: 4800000 },
]

const PENDING = [
  { id:'1', type:'Verification Request', user:'brian@example.com',    status:'pending', time:'2h ago' },
  { id:'2', type:'Opportunity Approval', user:'SafaricomHR',          status:'pending', time:'3h ago' },
  { id:'3', type:'Dispute Resolution',   user:'john.doe@example.com', status:'urgent',  time:'5h ago' },
  { id:'4', type:'Payout Request',       user:'jane@startup.ke',      status:'pending', time:'1d ago' },
]

export default function AdminPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, label, value, trend, color, bg }) => (
          <div key={label} className="card card-hover">
            <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center mb-4`}>
              <Icon size={20} />
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-sm text-slate-400 mt-1">{label}</p>
            <p className="text-xs text-slate-600 mt-1">{trend}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold text-lg text-white mb-5">User Growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={GROWTH_DATA}>
              <defs>
                <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2e47" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8da4c4', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v/1000}K`} />
              <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #263550', borderRadius: '8px', fontSize: 12 }}
                formatter={value => [Number(value ?? 0).toLocaleString(), 'Users']} />
              <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2.5} fill="url(#usersGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-bold text-lg text-white mb-5">Monthly Revenue (KSh)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GROWTH_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2e47" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8da4c4', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v/1000000}M`} />
              <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #263550', borderRadius: '8px', fontSize: 12 }}
                formatter={value => [`KSh ${(Number(value ?? 0)/1000000).toFixed(1)}M`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending actions */}
      <div className="card">
        <h2 className="font-bold text-lg text-white mb-4">Pending Actions</h2>
        <div className="space-y-3">
          {PENDING.map(item => (
            <div key={item.id}
              className="flex items-center justify-between p-4 rounded-xl bg-bg-2
                border border-surface-border hover:border-surface-border2 transition-all flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center
                  ${item.status === 'urgent' ? 'bg-red-400/10 text-red-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                  {item.status === 'urgent' ? <AlertTriangle size={16} /> : <Clock size={16} />}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{item.type}</p>
                  <p className="text-xs text-slate-500">{item.user} · {item.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={item.status === 'urgent' ? 'badge-danger' : 'badge-warning'}>
                  {item.status}
                </span>
                <button className="btn-primary text-xs py-1.5 px-3">Review</button>
                <button className="btn-ghost text-xs py-1.5 px-3">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
