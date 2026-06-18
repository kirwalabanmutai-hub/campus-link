'use client'
import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const MONTHLY_DATA = [
  { month: 'Jan', income: 35000, expenses: 18000 },
  { month: 'Feb', income: 42000, expenses: 21000 },
  { month: 'Mar', income: 38000, expenses: 19000 },
  { month: 'Apr', income: 51000, expenses: 24000 },
  { month: 'May', income: 44000, expenses: 20000 },
  { month: 'Jun', income: 48000, expenses: 22000 },
]

const RECORDS = [
  { id:'1', source:'Safaricom Salary',   category:'Employment', amount: 80000, type:'income',  date:'Jun 1, 2024' },
  { id:'2', source:'Freelance UI Gig',   category:'Freelance',  amount: 15000, type:'income',  date:'Jun 5, 2024' },
  { id:'3', source:'House Rent',         category:'Housing',    amount:-22000, type:'expense', date:'Jun 1, 2024' },
  { id:'4', source:'Groceries',          category:'Food',       amount: -8000, type:'expense', date:'Jun 10, 2024' },
  { id:'5', source:'Online Course',      category:'Education',  amount: -4500, type:'expense', date:'Jun 12, 2024' },
  { id:'6', source:'Data Analysis Gig',  category:'Freelance',  amount: 12000, type:'income',  date:'Jun 15, 2024' },
]

const CATEGORIES = ['All', 'Employment', 'Freelance', 'Business', 'Housing', 'Food', 'Education']

export default function IncomePage() {
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const totalIncome   = RECORDS.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0)
  const totalExpenses = RECORDS.filter(r => r.type === 'expense').reduce((s, r) => s + Math.abs(r.amount), 0)
  const savings       = totalIncome - totalExpenses

  const filtered = RECORDS.filter(r => filter === 'All' || r.category === filter)

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="section-title">Income Tracker</h1>
          <p className="text-slate-400 mt-1">Track income, expenses, and savings across all sources</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2">
          <Plus size={16} /> Add Record
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Income',   value: `KSh ${totalIncome.toLocaleString()}`,   icon: TrendingUp,   color: 'text-primary',    bg: 'bg-primary/10' },
          { label: 'Total Expenses', value: `KSh ${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-red-400',    bg: 'bg-red-400/10' },
          { label: 'Net Savings',    value: `KSh ${savings.toLocaleString()}`,        icon: PiggyBank,    color: 'text-accent',     bg: 'bg-accent/10'  },
          { label: 'Savings Rate',   value: `${Math.round(savings/totalIncome*100)}%`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card card-hover">
            <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>
              <Icon size={19} />
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-lg text-white">Income vs Expenses</h2>
          <span className="badge-primary">6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_DATA} barSize={22} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2e47" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8da4c4', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v/1000}K`} />
            <Tooltip
              contentStyle={{ background: '#1a2235', border: '1px solid #263550', borderRadius: '8px', fontSize: 12 }}
              formatter={(v: number, name: string) => [`KSh ${v.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income"   fill="#10b981" radius={[4,4,0,0]} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Records table */}
      <div className="card">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="font-bold text-lg text-white">Transaction Records</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all
                  ${filter === c
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-surface border-surface-border text-slate-400 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map(r => (
            <div key={r.id}
              className="flex items-center justify-between p-4 rounded-xl bg-bg-2
                border border-surface-border hover:border-surface-border2 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm
                  ${r.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-red-400/10 text-red-400'}`}>
                  {r.type === 'income' ? '↑' : '↓'}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{r.source}</p>
                  <p className="text-xs text-slate-500">{r.category} · {r.date}</p>
                </div>
              </div>
              <p className={`font-bold text-base ${r.type === 'income' ? 'text-primary' : 'text-red-400'}`}>
                {r.type === 'income' ? '+' : '−'} KSh {Math.abs(r.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
