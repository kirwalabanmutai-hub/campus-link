'use client'
import { useEffect, useState } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { getApiErrorMessage, incomeApi } from '@/lib/api'
import type { IncomeRecord } from '@/types'

const CATEGORIES = ['All', 'Employment', 'Freelance', 'Business', 'Housing', 'Food', 'Education']

async function fetchIncomeRecords(): Promise<IncomeRecord[]> {
  const limit = 500
  const records: IncomeRecord[] = []
  let page = 1

  while (true) {
    const response = await incomeApi.getRecords({ limit, page })
    const batch = response.data.data.map(record => ({
      ...record,
      amount: Number(record.amount),
    }))
    records.push(...batch)
    if (batch.length < limit) return records
    page += 1
  }
}

export default function IncomePage() {
  const [filter, setFilter] = useState('All')
  const [records, setRecords] = useState<IncomeRecord[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [form, setForm] = useState<{
    source: string
    category: string
    amount: string
    type: 'income' | 'expense'
  }>({ source: '', category: 'Employment', amount: '', type: 'income' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let active = true
    fetchIncomeRecords()
      .then(nextRecords => {
        if (active) {
          setRecords(nextRecords)
          setLoadError('')
        }
      })
      .catch(error => {
        if (active) {
          setLoadError(getApiErrorMessage(error, 'Could not load your income records. Please try again.'))
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  async function retryLoadRecords() {
    setLoading(true)
    setLoadError('')
    try {
      setRecords(await fetchIncomeRecords())
    } catch (error) {
      setLoadError(getApiErrorMessage(error, 'Could not load your income records. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const totalIncome   = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0)
  const totalExpenses = records.filter(r => r.type === 'expense').reduce((s, r) => s + Math.abs(r.amount), 0)
  const savings       = totalIncome - totalExpenses

  const filtered = records.filter(r => filter === 'All' || r.category === filter)

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date()
    monthDate.setDate(1)
    monthDate.setMonth(monthDate.getMonth() - 5 + index)
    const monthPrefix = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    const monthRecords = records.filter(record => record.date.startsWith(monthPrefix))
    return {
      month: new Intl.DateTimeFormat('en', { month: 'short' }).format(monthDate),
      income: monthRecords
        .filter(record => record.type === 'income')
        .reduce((sum, record) => sum + record.amount, 0),
      expenses: monthRecords
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + Math.abs(record.amount), 0),
    }
  })

  async function addRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!form.source.trim() || !Number.isFinite(amount) || amount <= 0) {
      setFormError('Enter a description and an amount greater than zero.')
      return
    }

    setSaving(true)
    setFormError('')
    try {
      const response = await incomeApi.addRecord({
        source: form.source.trim(),
        category: form.category,
        amount,
        type: form.type,
        date: new Date().toISOString().slice(0, 10),
      })
      const savedRecord: IncomeRecord = {
        ...response.data.data,
        amount: Number(response.data.data.amount),
      }
      setRecords(current => [savedRecord, ...current])
      setForm({ source: '', category: 'Employment', amount: '', type: 'income' })
      setShowModal(false)
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not save this record. Please try again.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="section-title">Income Tracker</h1>
          <p className="text-slate-400 mt-1">Track income, expenses, and savings across all sources</p>
        </div>
        <button type="button" onClick={() => setShowModal(true)} className="btn-primary text-sm py-2">
          <Plus size={16} /> Add Record
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Income',   value: `KSh ${totalIncome.toLocaleString()}`,   icon: TrendingUp,   color: 'text-primary',    bg: 'bg-primary/10' },
          { label: 'Total Expenses', value: `KSh ${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-red-400',    bg: 'bg-red-400/10' },
          { label: 'Net Savings',    value: `KSh ${savings.toLocaleString()}`,        icon: PiggyBank,    color: 'text-accent',     bg: 'bg-accent/10'  },
          { label: 'Savings Rate',   value: `${totalIncome ? Math.round(savings/totalIncome*100) : 0}%`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
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
          <span className="badge-primary">Last 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barSize={22} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2e47" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#8da4c4', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8da4c4', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v/1000}K`} />
            <Tooltip
              contentStyle={{ background: '#1a2235', border: '1px solid #263550', borderRadius: '8px', fontSize: 12 }}
              formatter={(value, name) => {
                const label = String(name ?? '')
                return [`KSh ${Number(value ?? 0).toLocaleString()}`, label.charAt(0).toUpperCase() + label.slice(1)]
              }}
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
        {loadError && (
          <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-red-400">
            <span>{loadError}</span>
            <button type="button" onClick={retryLoadRecords} className="underline" disabled={loading}>
              Retry
            </button>
          </div>
        )}
        <div className="space-y-2">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading records…</p>
          ) : !filtered.length ? (
            <p className="py-6 text-center text-sm text-slate-400">
              {filter === 'All' ? 'No records yet. Add your first income or expense.' : `No ${filter.toLowerCase()} records.`}
            </p>
          ) : filtered.map(r => (
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
                  <p className="text-xs text-slate-500">
                    {r.category} · {new Intl.DateTimeFormat('en-KE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(`${r.date.slice(0, 10)}T00:00:00`))}
                  </p>
                </div>
              </div>
              <p className={`font-bold text-base ${r.type === 'income' ? 'text-primary' : 'text-red-400'}`}>
                {r.type === 'income' ? '+' : '−'} KSh {Math.abs(r.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-record-title"
            className="card w-full max-w-md border-surface-border2 p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="add-record-title" className="text-xl font-bold text-white">Add Record</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                Close
              </button>
            </div>
            <form onSubmit={addRecord} className="space-y-4">
              <div>
                <label htmlFor="record-source" className="label">Description</label>
                <input
                  id="record-source"
                  className="input"
                  value={form.source}
                  onChange={event => setForm(current => ({ ...current, source: event.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="record-type" className="label">Type</label>
                  <select
                    id="record-type"
                    className="input"
                    value={form.type}
                    onChange={event => setForm(current => ({
                      ...current,
                      type: event.target.value as 'income' | 'expense',
                    }))}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="record-category" className="label">Category</label>
                  <select
                    id="record-category"
                    className="input"
                    value={form.category}
                    onChange={event => setForm(current => ({ ...current, category: event.target.value }))}
                  >
                    {CATEGORIES.filter(category => category !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="record-amount" className="label">Amount (KSh)</label>
                <input
                  id="record-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="input"
                  value={form.amount}
                  onChange={event => setForm(current => ({ ...current, amount: event.target.value }))}
                  required
                />
              </div>
              {formError && <p role="alert" className="text-sm text-red-400">{formError}</p>}
              <button type="submit" disabled={saving} className="btn-primary w-full py-3">
                {saving ? 'Saving…' : 'Save Record'}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
