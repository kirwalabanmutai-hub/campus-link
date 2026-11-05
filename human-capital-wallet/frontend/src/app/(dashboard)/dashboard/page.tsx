'use client'
import { Briefcase, Star, DollarSign, TrendingUp, Bell, Clock, CheckCircle } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'

const STATS = [
  { icon: Briefcase, label: 'Opportunities Applied', value: '24',    trend: '+3 this week',  color: 'text-primary',  bg: 'bg-primary/10' },
  { icon: Star,      label: 'Reputation Score',       value: '87/100', trend: '+5 this month', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { icon: DollarSign,label: 'Income (This Month)',    value: 'KSh 48K', trend: '+12%',         color: 'text-accent',  bg: 'bg-accent/10' },
  { icon: TrendingUp,label: 'Portfolio Value',        value: 'KSh 120K', trend: '+8.4% ROI',  color: 'text-green-400', bg: 'bg-green-400/10' },
]

const INCOME_DATA = [
  { month: 'Jan', income: 30000 },
  { month: 'Feb', income: 42000 },
  { month: 'Mar', income: 35000 },
  { month: 'Apr', income: 51000 },
  { month: 'May', income: 44000 },
  { month: 'Jun', income: 48000 },
]

const RECENT_OPP = [
  { title: 'Data Analyst — Safaricom',      type: 'job',         deadline: '3 days',  status: 'applied' },
  { title: 'Google Africa Scholarship',      type: 'scholarship', deadline: '10 days', status: 'saved' },
  { title: 'UX Freelance — StartupKE',       type: 'gig',         deadline: '2 days',  status: 'applied' },
  { title: 'AWS Hackathon 2024',             type: 'competition', deadline: '5 days',  status: 'saved' },
]

const ACTIVITY = [
  { text: 'Profile verified by HCW',       time: '2h ago', type: 'success' },
  { text: 'New review received (4.8 ★)',   time: '5h ago', type: 'success' },
  { text: 'Application viewed by Safaricom', time: '1d ago', type: 'info' },
  { text: 'Skill endorsement: Python',     time: '2d ago', type: 'success' },
]

const TYPE_BADGE: Record<string, string> = {
  job: 'badge-primary', scholarship: 'badge-accent',
  gig: 'badge-warning', competition: 'badge-success',
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Good morning, Brian 👋</h1>
        <p className="text-slate-400 mt-1">Here&apos;s your human capital overview for today.</p>
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

      {/* Chart + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-white">Income Overview</h2>
            <span className="badge-primary">6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={INCOME_DATA}>
              <defs>
                <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2e47" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8da4c4', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v/1000}K`} />
              <Tooltip
                contentStyle={{ background: '#1a2235', border: '1px solid #263550', borderRadius: '8px', fontSize: 12 }}
                formatter={value => [`KSh ${Number(value ?? 0).toLocaleString()}`, 'Income']}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5}
                fill="url(#incG)" dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-bold text-lg text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center
                  ${a.type === 'success' ? 'bg-primary/15' : 'bg-accent/15'}`}>
                  {a.type === 'success'
                    ? <CheckCircle size={13} className="text-primary" />
                    : <Bell size={13} className="text-accent" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-300">{a.text}</p>
                  <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                    <Clock size={11} /> {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="card">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-lg text-white">Recent Opportunities</h2>
          <Link href="/opportunities" className="text-sm text-primary font-semibold hover:underline">View all</Link>
        </div>
        <div className="space-y-3">
          {RECENT_OPP.map(opp => (
            <div key={opp.title}
              className="flex items-center justify-between p-4 rounded-xl bg-bg-2
                border border-surface-border hover:border-surface-border2 transition-all">
              <div className="flex items-center gap-3">
                <span className={`${TYPE_BADGE[opp.type]}`}>{opp.type}</span>
                <span className="text-sm font-semibold text-white">{opp.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">{opp.deadline} left</span>
                <span className={opp.status === 'applied' ? 'badge-success' : 'badge-warning'}>
                  {opp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
