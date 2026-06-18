'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Plus, BarChart3, AlertTriangle } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const PORTFOLIO = [
  { id:'1', name:'Safaricom Shares',     type:'Stocks',   invested: 50000, current: 67000, roi: 34,  risk:'Medium', trend: 'up'   },
  { id:'2', name:'M-Akiba Bond',         type:'Bond',     invested: 30000, current: 33600, roi: 12,  risk:'Low',    trend: 'up'   },
  { id:'3', name:'Centum REIT',          type:'REIT',     invested: 20000, current: 18400, roi: -8,  risk:'Medium', trend: 'down' },
  { id:'4', name:'Bitcoin (0.002 BTC)',  type:'Crypto',   invested: 15000, current: 21000, roi: 40,  risk:'High',   trend: 'up'   },
]

const HISTORY = [
  { month: 'Jan', value: 100000 },
  { month: 'Feb', value: 108000 },
  { month: 'Mar', value: 104000 },
  { month: 'Apr', value: 115000 },
  { month: 'May', value: 129000 },
  { month: 'Jun', value: 140000 },
]

const RISK_BADGE: Record<string, string> = {
  Low: 'badge-success', Medium: 'badge-warning', High: 'badge-danger',
}

export default function InvestmentsPage() {
  const totalInvested = PORTFOLIO.reduce((s, i) => s + i.invested, 0)
  const totalCurrent  = PORTFOLIO.reduce((s, i) => s + i.current, 0)
  const totalROI      = ((totalCurrent - totalInvested) / totalInvested * 100).toFixed(1)

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="section-title">Investment Module</h1>
          <p className="text-slate-400 mt-1">Track your portfolio, calculate ROI, and analyze risk</p>
        </div>
        <button className="btn-primary text-sm py-2"><Plus size={16} /> Add Investment</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Invested',  value: `KSh ${totalInvested.toLocaleString()}`, color: 'text-white' },
          { label: 'Current Value',   value: `KSh ${totalCurrent.toLocaleString()}`,  color: 'text-primary' },
          { label: 'Total Gain',      value: `KSh ${(totalCurrent - totalInvested).toLocaleString()}`, color: 'text-green-400' },
          { label: 'Overall ROI',     value: `+${totalROI}%`, color: 'text-primary' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card card-hover">
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Portfolio chart */}
      <div className="card">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" /> Portfolio Growth
          </h2>
          <span className="badge-success">+{totalROI}% all time</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={HISTORY}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2e47" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8da4c4', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v/1000}K`} />
            <Tooltip
              contentStyle={{ background: '#1a2235', border: '1px solid #263550', borderRadius: '8px', fontSize: 12 }}
              formatter={(v: number) => [`KSh ${v.toLocaleString()}`, 'Portfolio Value']}
            />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5}
              dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings */}
      <div className="card">
        <h2 className="font-bold text-lg text-white mb-5">Holdings</h2>
        <div className="space-y-3">
          {PORTFOLIO.map(inv => (
            <div key={inv.id}
              className="flex items-center justify-between p-4 rounded-xl bg-bg-2
                border border-surface-border hover:border-surface-border2 transition-all flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${inv.trend === 'up' ? 'bg-primary/10 text-primary' : 'bg-red-400/10 text-red-400'}`}>
                  {inv.trend === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div>
                  <p className="font-bold text-white">{inv.name}</p>
                  <p className="text-xs text-slate-500">{inv.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">KSh {inv.current.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">vs KSh {inv.invested.toLocaleString()}</p>
                </div>
                <span className={`font-bold text-sm ${inv.roi >= 0 ? 'text-primary' : 'text-red-400'}`}>
                  {inv.roi >= 0 ? '+' : ''}{inv.roi}%
                </span>
                <span className={RISK_BADGE[inv.risk]}><AlertTriangle size={11} className="inline" /> {inv.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="card">
        <h2 className="font-bold text-lg text-white mb-4">ROI Calculator</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Investment Amount (KSh)</label>
            <input type="number" className="input" placeholder="50000" defaultValue="50000" />
          </div>
          <div>
            <label className="label">Expected Annual Return (%)</label>
            <input type="number" className="input" placeholder="12" defaultValue="12" />
          </div>
          <div>
            <label className="label">Duration (Years)</label>
            <input type="number" className="input" placeholder="5" defaultValue="5" />
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-slate-400">Projected Value after 5 years:</p>
          <p className="text-2xl font-black text-primary mt-1">KSh 88,117</p>
          <p className="text-sm text-slate-500">+76.2% total return</p>
        </div>
      </div>
    </div>
  )
}
